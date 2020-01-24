// pipeline {
//     agent any
//     stages {
//         stage('Build') {
//             steps {
//                 shortCommit = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
//                 echo shortCommit
//             }
//         }
//     }
// }
node {
  checkout scm

  stage('Build') {
    sh 'env|sort'
    docker.withRegistry('', 'docker-registry') {
      def shortCommit = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
      def customImage = docker.build("t0ster/kuber-ui:${shortCommit}")
      customImage.push()
      // sh "docker rmi t0ster/kuber-ui:${shortCommit}"
    }
  }
}
