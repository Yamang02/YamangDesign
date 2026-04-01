/**
 * SonarCloud 이슈를 API로 받아 JSON 파일로 저장합니다.
 *
 * 필수 환경 변수:
 *   SONAR_TOKEN         — My Account → Security 에서 발급한 User Token
 *   SONAR_PROJECT_KEY   — SonarCloud 프로젝트 키 (Project Information)
 *
 * 선택:
 *   SONAR_ORGANIZATION   — SonarCloud 조직 키 (대시보드 URL 또는 Project Information;
 *                          Web API에서 component 검색 시 SonarCloud는 organization 지정이 필요할 수 있음)
 *   SONAR_ISSUES_OUT    — 출력 경로 (기본: ./sonar-issues.json)
 *   SONAR_BRANCH        — 브랜치 분석 시 브랜치 이름
 *   SONAR_ISSUE_STATUSES — 쉼표 구분 (기본: OPEN)
 *   SONAR_FILTER_PROJECT — 이슈를 남길 Sonar 프로젝트 키(들). 쉼표 구분.
 *                          Application/상위 component 조회 시 다른 repo 이슈가 섞일 때
 *                          예: Yamang02_YamangDesign 만 저장.
 *                          API `projects` 파라미터 + 수신 후 `issue.project` 로 한 번 더 걸러 저장.
 *
 * 사용 예:
 *   set SONAR_TOKEN=...
 *   set SONAR_PROJECT_KEY=my_project_key
 *   set SONAR_ORGANIZATION=my_org_key
 *   set SONAR_FILTER_PROJECT=Yamang02_YamangDesign
 *   node scripts/fetch-sonarcloud-issues.mjs
 */

import { writeFileSync } from 'fs';
import { resolve } from 'path';

const BASE = 'https://sonarcloud.io/api/issues/search';
const PAGE_SIZE = 500;

const token = (process.env.SONAR_TOKEN ?? '').trim();
const projectKey = (process.env.SONAR_PROJECT_KEY ?? '').trim();
const organization = (process.env.SONAR_ORGANIZATION ?? '').trim();
const outPath = resolve(process.cwd(), process.env.SONAR_ISSUES_OUT || 'sonar-issues.json');
const branch = process.env.SONAR_BRANCH;
const statuses = process.env.SONAR_ISSUE_STATUSES || 'OPEN';

const filterProjectRaw = (process.env.SONAR_FILTER_PROJECT ?? '').trim();
const filterProjects = filterProjectRaw
  ? filterProjectRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  : [];

function usage() {
  console.error(`
필수: SONAR_TOKEN, SONAR_PROJECT_KEY
선택: SONAR_ORGANIZATION, SONAR_ISSUES_OUT, SONAR_BRANCH, SONAR_ISSUE_STATUSES, SONAR_FILTER_PROJECT
`);
}

if (!token || !projectKey) {
  usage();
  process.exit(1);
}

const auth = Buffer.from(`${token}:`, 'utf8').toString('base64');

async function fetchPage(page) {
  const url = new URL(BASE);
  url.searchParams.set('component', projectKey);
  url.searchParams.set('ps', String(PAGE_SIZE));
  url.searchParams.set('p', String(page));
  const statusList = statuses
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .join(',');
  if (statusList) {
    url.searchParams.set('statuses', statusList);
  }
  if (branch) {
    url.searchParams.set('branch', branch);
  }
  if (organization) {
    url.searchParams.set('organization', organization);
  }
  if (filterProjects.length) {
    url.searchParams.set('projects', filterProjects.join(','));
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SonarCloud API ${res.status}: ${text.slice(0, 500)}`);
  }

  return res.json();
}

function filterIssuesByProject(issues) {
  if (!filterProjects.length) {
    return issues;
  }
  const allowed = new Set(filterProjects);
  return issues.filter((i) => allowed.has(i.project));
}

const allIssues = [];
let page = 1;
let totalFromApi = 0;

for (;;) {
  const data = await fetchPage(page);
  if (page === 1 && typeof data.total === 'number') {
    totalFromApi = data.total;
  }
  const batch = filterIssuesByProject(data.issues ?? []);
  allIssues.push(...batch);
  const rawLen = (data.issues ?? []).length;
  if (rawLen < PAGE_SIZE) {
    break;
  }
  page += 1;
}

const payload = {
  fetchedAt: new Date().toISOString(),
  projectKey,
  organization: organization || null,
  branch: branch ?? null,
  statuses,
  filterProjects: filterProjects.length ? filterProjects : null,
  totalReported: totalFromApi,
  issueCount: allIssues.length,
  issues: allIssues,
};

writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
const filterNote = filterProjects.length ? ` (filtered: ${filterProjects.join(', ')})` : '';
console.log(
  `Wrote ${allIssues.length} issues${filterNote} (${totalFromApi ? `API total: ${totalFromApi}` : 'no total field'}) → ${outPath}`,
);
