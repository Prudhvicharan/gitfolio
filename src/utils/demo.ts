import type { GithubUser, GithubRepo } from '../types';
export const DEMO_USER: GithubUser = {login:'gitfolio-demo',id:0,name:'Alex Morgan',company:null,blog:null,location:null,email:null,bio:'I build accessible web experiences and tools that make everyday development a little easier.',public_repos:3,followers:0,following:0,created_at:'2022-01-01',twitter_username:null,avatar_url:''};
export const DEMO_REPOS: GithubRepo[] = [
  {id:1,name:'accessible-ui',description:'A collection of keyboard-friendly interface components.',language:'TypeScript',topics:['react','accessibility'],stargazers_count:0},
  {id:2,name:'dev-journal',description:'A lightweight writing space for project notes and ideas.',language:'JavaScript',topics:['javascript'],stargazers_count:0},
  {id:3,name:'tiny-tools',description:'Small Python utilities for everyday development tasks.',language:'Python',topics:['python'],stargazers_count:0},
].map(repo=>({...repo,full_name:`gitfolio-demo/${repo.name}`,html_url:`https://github.com/gitfolio-demo/${repo.name}`,forks_count:0,fork:false}));
