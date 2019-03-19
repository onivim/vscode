import * as path from "path";

import * as ExtensionHost from "./ExtensionHost";

let extensionPath = path.join(__dirname, "..", "extensions", "oni-api-tests", "package.json");

describe("documents", () => {
    test("opening / closing document fires respective events", async () => {
        await ExtensionHost.withExtensionHost([extensionPath], async (api) => {
            let extensionActivationPromise = api.waitForMessageOnce("MainThreadExtensionService", "$onDidActivateExtension");

            let onOpenPromise = api.waitForMessageOnce("MainThreadMessageService", "$showMessage", (v) => {
                let [_, data] = v;
                let info = JSON.parse(data);

                return info.type === "workspace.onDidOpenTextDocument" && info.filename == "D:\\test1.txt";
            })

            let onClosePromise = api.waitForMessageOnce("MainThreadMessageService", "$showMessage", (v) => {
                let [_, data] = v;
                let info = JSON.parse(data);

                return info.type === "workspace.onDidCloseTextDocument" && info.filename == "D:\\test1.txt";
            })

            await api.start();
            await extensionActivationPromise;

            let testModelAdded = {
                uri: {
                    scheme: "file",
                    path: "D:/test1.txt",
                },
                lines: ["hello", "world"],
                EOL: "\n",
                modeId: "plaintext",
                isDirty: true,
            };

            let update = {
                removedDocuments: [],
                addedDocuments: [testModelAdded],
                removedEditors: [],
                addedEditors: [],
                newActiveEditor: null,
            };

            api.sendNotification(["ExtHostDocumentsAndEditors", "$acceptDocumentsAndEditorsDelta", [update]]);

            await onOpenPromise;

            let closeUpdate = {
                removedDocuments: [testModelAdded.uri],
                addedDocuments :[],
                removedEditors: [],
                addedEditors: [],
                newActiveEditor: null,
            }

            api.sendNotification(["ExtHostDocumentsAndEditors", "$acceptDocumentsAndEditorsDelta", [closeUpdate]]);

            await onClosePromise;
        });
    });
});
