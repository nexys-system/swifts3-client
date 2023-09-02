export interface SwiftAuth {
  identity: {
    methods: ["password"];
    password: {
      user: { name: string; domain: { name: "Default" }; password: string };
    };
  };
  scope: { project: { id: string; domain: { id: "default" } } };
}
