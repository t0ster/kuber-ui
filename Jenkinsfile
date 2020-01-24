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
      def shortCommit = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
      def customImage = docker.build("t0ster/kuber-ui:${shortCommit}")
      customImage.push()
      // sh "docker rmi t0ster/kuber-ui:${shortCommit}"
    }
  }
}
