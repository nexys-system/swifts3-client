import fs from "fs";
import fetch, { Response } from "node-fetch";
import Identity from "./identity.js";
import { readFileToBuffer } from "./utils.js";

class SwiftFileStorage {
  url: string;
  identity: Identity;
  headers: { "content-type": string; "X-Auth-Token"?: string };

  constructor(
    objectStorageUrl: string,
    containerName: string,
    identity: Identity
  ) {
    this.url = objectStorageUrl + "/" + containerName;
    this.identity = identity;

    this.headers = {
      "content-type": "application/json",
    };
  }

  setHeaders(token: string): void {
    this.headers = {
      "X-Auth-Token": token,
      "content-type": "application/json",
    };
  }

  async request(
    {
      url,
      method = "GET",
      body = undefined,
    }: { url: string; body?: any; method?: string },
    iteration = 1
  ): Promise<Response> {
    const response = await fetch(url, {
      headers: this.headers,
      method,
      body,
    });

    //  console.log("status", response.status);

    if ([401, 403].includes(response.status)) {
      if (!this.identity) {
        throw Error("could not find refresh ");
      }

      if (iteration > 2) {
        throw Error(" iteration too high" + iteration);
      }

      const token = await this.identity.getToken();

      if (!token) {
        throw Error("could not get token");
      }

      this.setHeaders(token);

      return this.request({ url, method, body }, iteration + 1);
    }

    return response;
  }

  async list() {
    const response = await this.request({ url: this.url });

    const str = await response.text();

    return str.trim().split("\n");
  }

  async uploadFileFromFilePath(filename: string, filePath: string) {
    const body: Buffer = await readFileToBuffer(filePath);
    return this.uploadFile(filename, body);
  }

  async uploadFile(filename: string, body: Buffer): Promise<boolean> {
    const url = this.url + "/" + filename;

    const response = await this.request({
      url,
      method: "PUT",
      body,
    });

    if (response.ok) {
      console.log("File uploaded successfully");
    } else {
      console.error(
        `Failed to upload file: ${response.status} ${response.statusText}`
      );
    }

    return response.ok;
  }

  async downloadFile(filename: string) {
    const url = this.url + "/" + filename;

    const response = await this.request({ url });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error(`response body is undefined/null`);
    }

    const localPath = "./" + filename;

    const fileStream = fs.createWriteStream(localPath);
    response.body.pipe(fileStream);
    fileStream.on("finish", () => {
      console.log(`File downloaded to ${localPath}`);
    });
  }

  async deleteFile(filename: string) {
    const url = this.url + "/" + filename;

    const response = await this.request({ url, method: "DELETE" });

    return response.status;
  }

  async serveResponse(filename: string): Promise<Response> {
    const url = this.url + "/" + filename;

    const response = await this.request({ url });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return response;
  }

  async serveText(filename: string): Promise<string> {
    const response = await this.serveResponse(filename);

    return response.text();
  }

  async serve(filename: string): Promise<Buffer> {
    const response = await this.serveResponse(filename);
    return response.buffer();
  }
}

export default SwiftFileStorage;
