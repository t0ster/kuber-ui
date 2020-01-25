// pipeline {
//   agent any
//   stages {
//     stage('Build') {
//       steps {
//         script {
//           def shortCommit = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
//           docker.withRegistry('', 'docker-registry') {
//             def customImage = docker.build("t0ster/kuber-ui:${shortCommit}")
//             customImage.push()
//             // sh "docker rmi t0ster/kuber-ui:${shortCommit}"
//           }
//         }
//       }
//     }
//   }
// }
node {
  checkout scm
  def tag = null
  if (env.BRANCH_NAME == 'master') {
    tag = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
  } else if (env.CHANGE_BRANCH) {
    tag = env.CHANGE_BRANCH
  } else {
    tag = env.BRANCH_NAME
  }

  stage('Build') {
    sh 'env|sort'
    docker.withRegistry('', 'dockerhub-registry') {
      def customImage = docker.build("t0ster/kuber-ui:${tag}")
      customImage.push()
      sh "docker rmi t0ster/kuber-ui:${tag}"
    }
  }

  stage('Deploy') {
    dir('kuber') {
      git branch: 'master', changelog: false, poll: false, url: 'https://github.com/t0ster/kuber.git'
      sh "kubectl create namespace ui-${tag} || true"
      sh "helm -n ui-${tag} template kuber charts/kuber-stack --set host=ui-${tag}.${env.BASE_HOST} > kuber.yaml"
      sh "kubectl -n ui-${tag} apply -f kuber.yaml"
    }
  }
}
