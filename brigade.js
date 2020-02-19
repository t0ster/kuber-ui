const {events, Job, Group} = require("brigadier");
const checkRunImage = "brigadecore/brigade-github-check-run:latest";

events.on("check_suite:requested", checkRequested);
events.on("check_suite:rerequested", checkRequested);
events.on("check_run:rerequested", checkRequested);

async function checkRequested(e, p) {
  console.log("check requested");
  console.log(e);
  console.log(p);
  async function _checkRequested(name, n) {
    // Common configuration
    const env = {
      CHECK_PAYLOAD: e.payload,
      CHECK_NAME: name,
      CHECK_TITLE: "Echo Test",
    };

    // This will represent our build job. For us, it's just an empty thinger.
    const build = new Job(`build-${n}`, "t0ster/build-deploy:0.0.2", [
      "ls -la /root/.docker/config.json"
    ]);
    build.volumes = [{
      "name": "regcred",
      "secret": {
        "secretName": "regcred"
      }
    }];
    build.volumeMounts = [{
      "name": "regcred",
      "mountPath": "/root/.docker/config.json",
      "subPath": ".dockerconfigjson"
    }]

    // For convenience, we'll create three jobs: one for each GitHub Check
    // stage.
    const start = new Job(`start-run-${n}`, checkRunImage);
    // start.imageForcePull = true
    start.env = env;
    start.env.CHECK_SUMMARY = "Beginning test run";
    start.env.CHECK_DETAILS_URL = "https://google.com";

    const end = new Job(`end-run-${n}`, checkRunImage);
    // end.imageForcePull = true
    end.env = env;

    start.run();
    try {
      result = await build.run();
      end.env.CHECK_CONCLUSION = "success";
      end.env.CHECK_SUMMARY = "Build completed";
      const payload = JSON.parse(e.payload);
      end.env.CHECK_TEXT = `### This is a third-tier heading
${result.toString()}
\`\`\`${JSON.stringify(payload, null, 2)}
\`\`\`
`;
      end.env.CHECK_DETAILS_URL = "https://google.com";
      await end.run();
    } catch (err) {
      end.env.CHECK_CONCLUSION = "failure";
      end.env.CHECK_SUMMARY = "Build failed";
      end.env.CHECK_TEXT = `Error: ${ err }`;
      await end.run();
    }
  }

  _checkRequested("MyService", "1");
  _checkRequested("MyService 2", "2");
}
