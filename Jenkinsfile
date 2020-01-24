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
      shortCommit = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
      echo shortCommit
    }
}
