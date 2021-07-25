// ==UserScript==
// @author       https://twitter.com/dbumbeishvili
// @name         Github - Create branch from issue
// @namespace    http://tampermonkey.net/
// @source       https://github.com/bumbeishvili/create-branch-from-issue
// @version      0.1
// @description  Creating same named branch from github issue
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

'use strict';

log('running!');
/*
    이 코드는 @match 되는 페이지로 접속할 때마다 실행된다.
    
    GitHub의 경우는 SPA이므로 이 코드는 최초 접속 시에만 실행된다.
    - SPA가 아닌 페이지로 redirect 하거나,
    - 새로고침 하면
    다시 실행된다.
*/
/*
    create-wip-pr-from-issue가 훨씬 좋겠지만,
    GitHub는 "No commits between master and pr-empty-test"를 이유로 빈 PR 생성을 거부한다.

    차선으로 Issue 이름에 맞춰 브랜치를 생성해주는 것 정도는 도와준다.
*/

/*
    이 코드는 항상 기본 브랜치에서 새 브랜치를 생성하는 것을 가정한다.
    - 아래 브랜치명이 맞지 않으면 form 파싱 과정에서 오류가 발생한다.
*/
const DEFAULT_BRANCH = 'master';
const DEFAULT_RETRY_COUNT = 10; // 재시도 횟수 (전체 실패 시 노답)
const DEFAULT_RETRY_TIMEOUT = 100; // 재시도 시간 간격 (ms)
const GITHUB_ALARM_TYPE = {
  ERROR: 'error',
  INFO: 'info',
};

// GitHub는 SPA이므로 MutationObserver를 사용해야 페이지 변경에 대응할 수 있다.
// MutationObserver는 이슈 세부 페이지에 있을 때만 사용한다.
let observer = new MutationObserver(() => {
  log('ON MUTATION - RERENDER');
  removeIfButtonExists();
  createAndShowButton();
});

// GitHub는 SPA이므로 URL 변경 이벤트가 필요하다.
let pushState = history.pushState;
let prevUrl = '';
history.pushState = function () {
  prevUrl = location.href;
  pushState.apply(history, arguments);
  var currentUrl = location.href;
  if (prevUrl.includes('/issues/') && !currentUrl.includes('/issues/')) stopObserver();
  if (!prevUrl.includes('/issues/') && currentUrl.includes('/issues/')) {
    tryRender();
  }
};

// 최초 접속한 곳이 Issues 인 경우 곧장 실행
if (location.href.includes('/issues/')) {
  tryRender(DEFAULT_RETRY_COUNT);
}

function startObserver() {
  log('Observer CREATED');
  const IssueContainerElem = document.querySelector('#show_issue');
  observer.observe(IssueContainerElem, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });
}

function stopObserver() {
  // TODO: 1초 이전에 observer.disconnect 시도 시 오류 발생 가능함.
  log('Observer RELEASED');
  // disconnect는 observer를 죽이는 게 아니라, observe() 호출을 통한 재가동 전까지 이벤트를 받지 않는 것을 의미함.
  observer.disconnect();
}

// 정말 안타깝게도, GitHub SPA는 URL이 먼저 변경되고 컨텐츠가 갱신됨.
function tryRender(retry) {
  log('trying render...');
  // 1. document.body의 별개의 MutationObserver로 구현될까? 아마 안 될듯. 이게 계속 갱신이 됨;
  // 2. 1초 등의 하드 코딩 대기는 네트워크 상황을 반영하지 못함.
  if (retry <= 0) {
    log('final render trial failed...');
    return;
  }
  const pageLoaded = !!document.querySelector('#show_issue');
  if (pageLoaded) {
    createAndShowButton();
    startObserver();
  } else {
    setTimeout(() => tryRender(--retry), DEFAULT_RETRY_TIMEOUT);
  }
}

// 버튼이 이미 있는 경우 제거함
function removeIfButtonExists() {
  const buttonContainer = document.querySelector('div#create_branch_button_container');
  if (buttonContainer) {
    buttonContainer.remove();
  }
}

// 버튼을 생성하고 표시함
function createAndShowButton() {
  const GitHubElem = document.querySelector('#repo-content-pjax-container.repository-content');
  if (!GitHubElem) return;

  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'create_branch_button_container';
  buttonContainer.innerHTML = `
          <button 
              id="create_branch_button" 
              class="btn btn-sm"
          >
          Create Branch From This Issue
          </button>`;

  // prepend 함수는 맨 앞에 추가함
  // 이 선택자를 사용하는 이유는 GitHub이 Ajax로 계속 페이지를 갱신하기 때문임.
  // 이 위치는 갱신되지 않는 가장 적절한 곳으로 선택하였음.
  // .new-discussion-timeline 얘는 공통임
  // #repo-content-pjax-container.repository-content
  GitHubElem.prepend(buttonContainer);

  buttonContainer.addEventListener('click', () => {
    // 1. 이슈 정보 가져옴
    const repoUrl = window.location.href.split('issues')[0];
    const issueTitle = document.querySelector('.js-issue-title').innerText; // 이슈 이름 가져옴
    const issueId = window.location.pathname.split('/').pop(); // URL에 이슈 ID 나옴

    // 2. 라벨 정보 가져옴
    const issueLabelContainerElem = document.querySelector('.js-issue-labels'); // 이슈 컨테이너
    if (issueLabelContainerElem.children.length === 0) {
      displayGitHubAlarm(GITHUB_ALARM_TYPE.ERROR, '라벨을 설정해주세요. 첫 라벨이 브랜치 이름에 사용됩니다.');
      return;
    } else {
      displayGitHubAlarm(GITHUB_ALARM_TYPE.INFO, `잠시만 기다려주세요.`);
    }

    const issueType = issueLabelContainerElem.firstElementChild.firstElementChild.textContent; // 이슈 타입 만들어냄

    // 3. 브랜치 이름 결정
    const branchName = formatBranchName(`${issueType}-${issueId}-${issueTitle}`);

    // 4. 브랜치 생성 API 호출
    // Branch 생성 사이트에서 Auth 토큰을 복사해 API처럼 호출
    fetch(`${repoUrl}refs/${DEFAULT_BRANCH}?source_action=disambiguate&source_controller=files`)
      .then(d => d.text())
      .then(d => {
        const body = document.createElement('div');
        body.innerHTML = d;

        const formData = new FormData();
        const token = body.querySelector("input[name='authenticity_token']").value;
        formData.append('authenticity_token', token);
        formData.append('name', branchName);
        formData.append('branch', DEFAULT_BRANCH);
        formData.append('path_binary', '');

        // 참고로 Promise Chaining에서 Promise를 리턴하면 이 Promise를 대기하고, 이 결과값이 다음 체인으로 전달된다.
        return fetch(`${repoUrl}branches`, { body: formData, method: 'post' });
      })
      // 5. Copy to Clipboard
      // alert 보다 GitHub의 flash를 쓰는 게 좋다.
      .then(() => {
        const CHECKOUT_COMMAND = `git fetch && git checkout ${branchName}`;
        navigator.clipboard.writeText(CHECKOUT_COMMAND).then(function () {
          displayGitHubAlarm(GITHUB_ALARM_TYPE.INFO, `브랜치가 생성되었습니다: ${branchName}`);
          displayGitHubAlarm(GITHUB_ALARM_TYPE.INFO, `클립보드에 다음 내용이 저장되었습니다: ${CHECKOUT_COMMAND}`);
        });
      });
  });
}

// GitHub의 'flash' CSS를 활용해 알림을 표시
// append 형식으로 수행함
function displayGitHubAlarm(type, msg) {
  log('wtf?');
  const CSS_MAP = {
    [GITHUB_ALARM_TYPE.ERROR]: 'error',
    [GITHUB_ALARM_TYPE.INFO]: 'notice',
  };

  setTimeout(() => {
    const container = document.querySelector('#js-flash-container');

    container.innerHTML =
      container.innerHTML +
      `
        <div class="flash flash-full flash-${CSS_MAP[type]} ">
        <div class=" px-2">
            <button class="flash-close js-flash-close" type="button" aria-label="Dismiss this message">
            <svg aria-hidden="true" viewBox="0 0 16 16" version="1.1" data-view-component="true" height="16" width="16" class="octicon octicon-x">
                <path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
            </svg>
            </button>
            ${msg}
        </div>
        </div>
  `;
  }, 1000);
}

function formatBranchName(str) {
  // 1. trim
  str = str.replace(/^\s+|\s+$/g, '');

  // 2. lowercase
  str = str.toLowerCase();

  // 3. to english
  const fromLetter = 'şğàáäâèéëêìíïîòóöôùúüûñç·/_,:;';
  const toLetter = 'sgaaaaeeeeiiiioooouuuunc------';
  for (let i = 0, l = fromLetter.length; i < l; i++) {
    str = str.replace(new RegExp(fromLetter.charAt(i), 'g'), toLetter.charAt(i));
  }

  // 4. filter out non-alphanumeric
  // 5. replace whitespace to dash
  // 6. remove duplicated dashes
  str = str
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return str;
}

function log(str) {
  console.log(`%c[GitHub Branch Plugin] ${str}`, 'color: #aaa');
}
