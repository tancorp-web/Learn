import crypto from "node:crypto";

const MAX_FILE_BYTES = 3 * 1024 * 1024;
const SLOT_NAMES = new Set(["top", "middle", "bottom"]);
const MIME_EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif"
};

function send(res, status, body) {
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(body);
}
function secureEqual(a, b) {
  const left = Buffer.from(String(a || ""));
  const right = Buffer.from(String(b || ""));
  return left.length === right.length && left.length > 0 && crypto.timingSafeEqual(left, right);
}
function detectImage(buffer, mime) {
  if (mime === "image/jpeg") return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mime === "image/png") return buffer.length > 8 && buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if (mime === "image/gif") return ["GIF87a", "GIF89a"].includes(buffer.subarray(0, 6).toString("ascii"));
  if (mime === "image/webp") return buffer.length > 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  if (mime === "image/avif") return buffer.length > 12 && buffer.subarray(4, 12).toString("ascii").includes("ftyp") && /avif|avis/.test(buffer.subarray(8, 16).toString("ascii"));
  return false;
}
function githubHeaders(token) {
  return { "Authorization": "Bearer " + token, "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
}
async function githubGet(path, token, branch, repo) {
  const url = "https://api.github.com/repos/" + repo + "/contents/" + path.split("/").map(encodeURIComponent).join("/") + "?ref=" + encodeURIComponent(branch);
  const response = await fetch(url, { headers: githubHeaders(token) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("อ่าน GitHub ไม่สำเร็จ (" + response.status + ")");
  return response.json();
}
async function githubPut(path, content, sha, message, token, branch, repo) {
  const url = "https://api.github.com/repos/" + repo + "/contents/" + path.split("/").map(encodeURIComponent).join("/");
  const body = { message, content: Buffer.from(content).toString("base64"), branch };
  if (sha) body.sha = sha;
  const response = await fetch(url, { method: "PUT", headers: { ...githubHeaders(token), "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error("บันทึก GitHub ไม่สำเร็จ (" + response.status + "): " + (result.message || "unknown error"));
  return result;
}
export default async function handler(req, res) {
  if (req.method === "GET") {
    const ready = Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_BRANCH && process.env.BANNER_UPLOAD_PASSWORD);
    return send(res, 200, { ready, maxFileBytes: MAX_FILE_BYTES, allowedTypes: Object.keys(MIME_EXT) });
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return send(res, 405, { error: "Method not allowed" });
  }
  const expectedPassword = process.env.BANNER_UPLOAD_PASSWORD;
  if (!expectedPassword || !secureEqual((req.headers.authorization || "").replace(/^Bearer\s+/i, ""), expectedPassword)) {
    return send(res, 401, { error: "รหัสผ่านผู้ดูแลไม่ถูกต้อง หรือยังไม่ได้ตั้งค่าใน Vercel" });
  }
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY || "tancorp-web/Learn";
  const branch = process.env.GITHUB_BRANCH;
  if (!token || !branch) return send(res, 503, { error: "ยังไม่ได้ตั้งค่า GITHUB_TOKEN หรือ GITHUB_BRANCH ใน Vercel" });
  const { slot, contentType, dataBase64, alt = "", href = "" } = req.body || {};
  if (!SLOT_NAMES.has(slot)) return send(res, 400, { error: "ตำแหน่งแบนเนอร์ไม่ถูกต้อง" });
  if (!MIME_EXT[contentType] || typeof dataBase64 !== "string") return send(res, 400, { error: "ชนิดไฟล์หรือข้อมูลรูปภาพไม่ถูกต้อง" });
  const estimatedBytes = Math.floor(dataBase64.length * 3 / 4);
  if (!estimatedBytes || estimatedBytes > MAX_FILE_BYTES) return send(res, 413, { error: "รูปต้องมีขนาดไม่เกิน 3 MB" });
  const image = Buffer.from(dataBase64, "base64");
  if (image.length > MAX_FILE_BYTES || !detectImage(image, contentType)) return send(res, 400, { error: "ไฟล์ไม่ใช่รูปภาพชนิดที่ระบุ หรือไฟล์เสียหาย" });
  if (typeof alt !== "string" || alt.length > 300) return send(res, 400, { error: "คำอธิบายรูปยาวเกินกำหนด" });
  let safeHref = "";
  if (href) {
    try {
      const u = new URL(href);
      if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("invalid");
      safeHref = u.href;
    } catch (_) { return send(res, 400, { error: "ลิงก์ปลายทางต้องเป็น http หรือ https" }); }
  }
  const filename = slot + "-banner." + MIME_EXT[contentType];
  const imagePath = "adpic/" + filename;
  const manifestPath = "adpic/manifest.json";
  try {
    const oldImage = await githubGet(imagePath, token, branch, repo);
    await githubPut(imagePath, image, oldImage && oldImage.sha, "Upload " + slot + " banner image", token, branch, repo);
    const oldManifest = await githubGet(manifestPath, token, branch, repo);
    let manifest = {};
    if (oldManifest && oldManifest.content) {
      try { manifest = JSON.parse(Buffer.from(oldManifest.content, "base64").toString("utf8")); } catch (_) { manifest = {}; }
    }
    manifest[slot] = { imageUrl: "/" + imagePath, alt: alt || "แบนเนอร์ประชาสัมพันธ์", href: safeHref, contentType, updatedAt: new Date().toISOString() };
    await githubPut(manifestPath, JSON.stringify(manifest, null, 2) + "\n", oldManifest && oldManifest.sha, "Update HORA banner manifest", token, branch, repo);
    return send(res, 200, { ok: true, slot, path: imagePath, imageUrl: "/" + imagePath, manifest: "/" + manifestPath });
  } catch (error) {
    return send(res, 502, { error: error.message || "บันทึกไฟล์ไม่สำเร็จ" });
  }
};
