export function parseGithubUrl(url: string) {
    const regex =
        /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+?)(?:\.git|\/)?$/;

    const match = url.match(regex);

    if (!match) {
        throw new Error("Invalid GitHub URL");
    }

    return {
        owner: match[1],
        repo: match[2],
    };
}