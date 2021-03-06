import * as path from "path";

import * as ExtensionHost from "./ExtensionHost";

let extensionPath = path.join(__dirname, "..", "test_extensions", "oni-api-tests", "package.json");
let activationExtensionPath = path.join(__dirname, "..", "test_extensions", "oni-activation-events-tests", "package.json");

describe("activation", () => {
	test("get activation event for '*' activation type", async () => {
		await ExtensionHost.withExtensionHost([extensionPath], async (api) => {
		let promise = new Promise((c) => {

				api.onMessage.subscribe(msg => {
					const { payload } = msg;

					if(payload.methodName == "$onDidActivateExtension") {
						console.dir(payload);
						c();
					}
				});

			});

			await api.start();

			await promise;
		});
	});

	test("activates in response to onLanguage event", async () => {
		await ExtensionHost.withExtensionHost([activationExtensionPath], async (api) => {
		let promise = new Promise((c) => {

				api.onMessage.subscribe(msg => {
					const { payload } = msg;

					if(payload.methodName == "$onDidActivateExtension") {
						console.dir(payload);
						c();
					}
				});

			});

			await api.start();

            api.sendNotification(["ExtHostExtensionService", "$activateByEvent", ["onLanguage:testlang"]]);
			await promise;
		});
	});

	test("activates in response to onLanguage event", async () => {
		await ExtensionHost.withExtensionHost([activationExtensionPath], async (api) => {
		let promise = new Promise((c) => {

				api.onMessage.subscribe(msg => {
					const { payload } = msg;

					if(payload.methodName == "$onDidActivateExtension") {
						console.dir(payload);
						c();
					}
				});

			});

			await api.start();

            api.sendNotification(["ExtHostExtensionService", "$activateByEvent", ["onCommand:extension.helloWorld"]]);
			await promise;
		});
	});
});
