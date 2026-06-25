import express from "express";
import { Router } from "express";
import {parseGithubUrl} from "../utils/github";
import type { Request, Response } from "express";
import { Octokit } from "octokit";

const router = Router();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

router.post(
  "/analyse",
  async (req: Request, res: Response) => {
    const { githubUrl } = req.body;

    if (!githubUrl) {
      return res.status(400).json({
        message: "GitHub URL is required",
      });
    }

    const { owner, repo } = parseGithubUrl(githubUrl);

    try {
      const { data } = await octokit.request(
        "GET /repos/{owner}/{repo}",
        {
          owner,
          repo,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      return res.status(200).json({
        name: data.name,
        owner: data.owner.login,
        description: data.description,
        stars: data.stargazers_count,
        forks: data.forks_count,
        language: data.language,
        defaultBranch: data.default_branch,
        license: data.license?.name,
        topics: data.topics,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to fetch repository",
      });
    }
  }
);

export default router;