const {events, Job, Group} = require("brigadier");
const checkRunImage = "brigadecore/brigade-github-check-run:latest";

events.on("check_suite:requested", checkRequested);
events.on("check_suite:rerequested", checkRequested);
events.on("check_run:rerequested", checkRequested);

function buildImage(image) {
  const build = new Job('build', "t0ster/build-deploy:0.0.2", [
    "cd /src",
    "docker build . -t $IMAGE",
    "docker push $IMAGE"
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
  build.env = {
    "DOCKER_HOST": "tcp://dind:2375",
    "IMAGE": image
  }

  return build.run()
}

async function checkRequested(e, p) {
  console.log("check requested");

  const env = {
    CHECK_PAYLOAD: e.payload,
    CHECK_NAME: "Build",
    // CHECK_TITLE: "Echo Test"
  };

  const start = new Job('start-run-build', checkRunImage);
  // start.imageForcePull = true
  start.env = env;
  start.env.CHECK_TITLE = "Building..."
  start.env.CHECK_SUMMARY = "Beginning build";
  // start.env.CHECK_DETAILS_URL = "https://google.com";

  const end = new Job('end-run-build', checkRunImage);
  // end.imageForcePull = true
  end.env = env;

  start.run();

  try {
    const payload = JSON.parse(e.payload);
    const repoName = payload.body.repository.full_name;
    const branch = payload.body.check_suite.head_branch;
    result = await buildImage(`${repoName}:${branch}`);
    end.env.CHECK_CONCLUSION = "success";
    start.env.CHECK_TITLE = "Done"
    end.env.CHECK_SUMMARY = "Build completed";
    // const payload = JSON.stringify(JSON.parse(e.payload), null, 2);
    end.env.CHECK_TEXT = `### Build
${result.toString()}
`;
    // end.env.CHECK_DETAILS_URL = "https://google.com";
    await end.run();
  } catch (err) {
    end.env.CHECK_CONCLUSION = "failure";
    end.env.CHECK_SUMMARY = "Build failed";
    end.env.CHECK_TEXT = `Error: ${ err }`;
    await end.run();
  }
}
