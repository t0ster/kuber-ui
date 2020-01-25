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

  stage('Build') {
    sh 'env|sort'
    docker.withRegistry('', 'dockerhub-registry') {
      if (env.BRANCH_NAME == 'master') {
        def tagName = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
      } else if (env.CHANGE_BRANCH) {
        def tagName = env.CHANGE_BRANCH
      } else {
        def tagName = env.BRANCH_NAME
      }
      def customImage = docker.build("t0ster/kuber-ui:${tagName}")
      customImage.push()
      // sh "docker rmi t0ster/kuber-ui:${tag}"
    }
  }
}
