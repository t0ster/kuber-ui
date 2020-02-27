const {events, Job, Group} = require("brigadier");
const checkRunImage = "brigadecore/brigade-github-check-run:latest";

events.on("check_suite:requested", checkRequested);
events.on("check_suite:rerequested", checkRequested);
events.on("check_run:rerequested", checkRequested);


function buildImage(e) {
  const repoName = e.payload_obj.body.repository.full_name;
  const branch = e.payload_obj.body.check_suite.head_branch;

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
    "IMAGE": `${repoName}:${branch}`
  }

  start_env = {
    "CHECK_TITLE": "Building...",
    "CHECK_SUMMARY": "Beginning build"
  }
  async function end_env() {
    result = await build.run();
    env = {}
    env.CHECK_SUMMARY = "Build completed";
    // const payload = JSON.stringify(JSON.parse(e.payload), null, 2);
    env.CHECK_TEXT = `### Build
${result.toString()}
`;
    // end.env.CHECK_DETAILS_URL = "https://google.com";
    return env;
  }
  return {
    "start_env": start_env,
    "end_env": end_env
  }
}

function reviewdog(e) {
  const job = new Job('reviewdog', "t0ster/reviewdog-js", [
    "tail -f /dev/null"
  ]);
  job.env = {CHECK_PAYLOAD: e.payload}


  start_env = {
    "CHECK_TITLE": "Reviewdog...",
    "CHECK_SUMMARY": "Reviewdog started"
  }
  async function end_env() {
    result = await build.run();
    env = {}
    env.CHECK_SUMMARY = "Reviewdog completed";
    // const payload = JSON.stringify(JSON.parse(e.payload), null, 2);
    env.CHECK_TEXT = `### Reviewdog
${result.toString()}
`;
    // end.env.CHECK_DETAILS_URL = "https://google.com";
    return env;
  }
  return {
    "start_env": start_env,
    "end_env": end_env
  }
}

async function step(e, check_name, job) {
  const env = {
    CHECK_PAYLOAD: e.payload,
    CHECK_NAME: check_name,
  };

  result = job(e);
  const start = new Job(`gh-check-start-${Date.now()}`, checkRunImage);
  start.useSource = false;
  // start.imageForcePull = true
  start.env = env;
  start.env = {...start.env, ...result.start_env}

  const end = new Job(`gh-check-end-${Date.now()}`, checkRunImage);
  end.useSource = false;
  // end.imageForcePull = true
  end.env = env;

  start.run();

  try {
    end.env.CHECK_CONCLUSION = "success";
    end.env.CHECK_TITLE = "Done";
    end.env = {...end.env, ...(await result.end_env())}
    end.run();
  } catch (err) {
    end.env.CHECK_CONCLUSION = "failure";
    end.env.CHECK_TITLE = "Failure";
    end.env.CHECK_SUMMARY = "Failed";
    end.env.CHECK_TEXT = `Error: ${ err }`;
    end.run();
  }
}

async function checkRequested(e, p) {
  e.payload_obj = JSON.parse(e.payload);
  // step(e, "Build", buildImage);
  step(e, "Reviewdog", reviewdog);
}
