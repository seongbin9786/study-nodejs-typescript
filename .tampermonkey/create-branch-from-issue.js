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
function stringToSlug(str) {
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

(function () {
  'use strict';
  // TODO: Retry 로직 필요. 새로고침해야 되는 경우가 좀 있음.
  if (!document.querySelector('.gh-header-actions')) return;

  const $createIssueFromBranchButton = document.createElement('div');
  $createIssueFromBranchButton.innerHTML = `
      <button 
          id="create_branch_button" 
          style="margin-left:10px!important; background-color:#0C61FE" 
          class="d-inline-block float-none m-0 mr-md-0 btn btn-sm btn-primary "
      >
      Create Branch From This Issue
      </button>`;

  // prepend 함수는 맨 앞에 추가함
  document.querySelector('.gh-header-actions').append($createIssueFromBranchButton);

  // Attach event to button
  // Issue new branch creation command
  $createIssueFromBranchButton.addEventListener('click', () => {
    const issueTitle = document.querySelector('.js-issue-title').innerText;
    const issueId = window.location.pathname.split('/').pop();
    const branchTitle = stringToSlug(`issue ${issueId}-${issueTitle}`);
    let branch = 'main';
    fetch(`${repoUrl}refs/${branch}?source_action=disambiguate&source_controller=files`)
      .then(d => d.text())
      .then(d => {
        const $el = document.createElement('div');
        $el.innerHTML = d;
        const $form = $el.querySelector('form');
        const $name = $form.querySelector('#name');
        $name.value = branchTitle;
        document.body.appendChild($form);
        $form.submit();
      });
  });
})();

// Feature: Copy branch checkout command into clipboard
(function () {
  console.log(location);
  console.log(window.location.origin + window.location.pathname);
  if (
    window.location.href === window.location.origin + window.location.pathname ||
    window.location.href === window.location.origin + window.location.pathname + '/' ||
    window.location.href.match('/tree/*')
  ) {
    let branchId = 'main';
    if (window.location.href.match('/tree/*')) {
      branchId = window.location.href.split('tree')[1].substring(1);
    }
    const $main = document.querySelector('main');
    const $commandForm = document.createElement('div');
    $commandForm.innerHTML = `<div class="float-right pull-right p-3">
        <input
          type="text"
          name="input-checkout-command"
          value="git fetch && git checkout ${branchId}"
          class="form-control d-inline-block"
          id="input-checkout-command"
          readonly
        />
        <button type="button" id="button-checkout-command" class="btn flex-self-end" data-toggle="tooltip" data-placement="top" title="Copy branch checkout command into clipboard">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><path fill-rule="evenodd" d="M5.75 1a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-4.5zm.75 3V2.5h3V4h-3zm-2.874-.467a.75.75 0 00-.752-1.298A1.75 1.75 0 002 3.75v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-9.5a1.75 1.75 0 00-.874-1.515.75.75 0 10-.752 1.298.25.25 0 01.126.217v9.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.126-.217z"/></svg>
        </button>
        <div class="text-muted" id="hint-checkout-command" style="visibility: hidden;"><small>Copied to clipboard</small></div>
      </div>
      `;
    $main.prepend($commandForm);
    document.querySelector('button#button-checkout-command').addEventListener('click', () => {
      const copyText = document.getElementById('input-checkout-command');
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      document.execCommand('copy');
      document.querySelector('div#hint-checkout-command').style.visibility = 'visible';
      setTimeout(() => {
        document.querySelector('div#hint-checkout-command').style.visibility = 'hidden';
      }, 2000);
    });
  }
})();
