pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'docker ps -a'
                sh 'kubectl get pod -A'
            }
        }
    }
}
