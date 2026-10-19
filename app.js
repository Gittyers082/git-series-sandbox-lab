// app.js — fetches every JSON profile in /profiles via the public GitHub API
// and renders a card per student

const OWNER = "SLU-AWS-Cloud";
const REPO = "git-series-sandbox-lab";
const BRANCH = "main";

const grid = document.getElementById("profile-grid");
const status = document.getElementById("status");

async function fetchProfileList() {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/profiles?ref=${BRANCH}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const files = await res.json();
  return files.filter((f) => f.name.endsWith(".json") && f.name !== "template.json");
}

async function fetchProfile(file) {
  const res = await fetch(file.download_url);
  if (!res.ok) throw new Error(`Could not load ${file.name}`);
  return res.json();
}

function renderCard(profile) {
  const card = document.createElement("div");
  card.className = "bg-white rounded-lg shadow p-4 flex flex-col items-center text-center";

  const avatar = document.createElement("img");
  avatar.src = `https://github.com/${profile.githubUsername}.png?size=100`;
  avatar.alt = profile.name;
  avatar.className = "w-20 h-20 rounded-full mb-3";

  const name = document.createElement("h2");
  name.textContent = profile.name;
  name.className = "font-semibold text-lg";

  const role = document.createElement("p");
  role.textContent = profile.role;
  role.className = "text-slate-500 text-sm";

  const lang = document.createElement("p");
  lang.textContent = `Favorite language: ${profile.favoriteLanguage}`;
  lang.className = "text-slate-600 text-sm mt-2";

  const fun = document.createElement("p");
  fun.textContent = profile.funFact;
  fun.className = "text-slate-400 text-xs mt-2 italic";

  card.append(avatar, name, role, lang, fun);
  return card;
}

async function main() {
  try {
    const files = await fetchProfileList();
    if (files.length === 0) {
      status.textContent = "No profiles yet — be the first to open a PR!";
      return;
    }
    status.textContent = `${files.length} student(s) have merged their profile.`;
    const profiles = await Promise.all(files.map(fetchProfile));
    profiles.forEach((p) => grid.appendChild(renderCard(p)));
  } catch (err) {
    status.textContent = "Could not load profiles (GitHub API rate limit or network issue).";
    console.error(err);
  }
}

main();