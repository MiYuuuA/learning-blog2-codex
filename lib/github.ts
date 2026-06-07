import { Octokit } from "@octokit/rest";

function getClient(): Octokit | null {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  return new Octokit({ auth: token });
}

function getRepoInfo(): { owner: string; repo: string; branch: string } | null {
  const fullRepo = process.env.GITHUB_REPO; // format: "owner/repo"
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!fullRepo) return null;
  const [owner, repo] = fullRepo.split("/");
  if (!owner || !repo) return null;
  return { owner, repo, branch };
}

export async function commitAndPush(
  filePath: string,
  content: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  const octokit = getClient();
  const repoInfo = getRepoInfo();

  if (!octokit || !repoInfo) {
    return { success: false, error: "GitHub 未配置（缺少 GITHUB_TOKEN 或 GITHUB_REPO）" };
  }

  try {
    const { owner, repo, branch } = repoInfo;
    const contentBase64 = Buffer.from(content, "utf-8").toString("base64");

    // Try to get the existing file (for its SHA, needed to update)
    let sha: string | undefined;
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: filePath,
        ref: branch,
      });
      if (!Array.isArray(data) && data.sha) {
        sha = data.sha;
      }
    } catch {
      // File doesn't exist yet — that's fine for new notes
    }

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message,
      content: contentBase64,
      branch,
      sha,
    });

    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "未知错误";
    return { success: false, error: `GitHub 提交失败: ${msg}` };
  }
}
