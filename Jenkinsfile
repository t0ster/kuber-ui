// node {
//   checkout scm
//
//   stage('Build') {
//     sh 'env|sort'
//     docker.withRegistry('', 'dockerhub-registry') {
//       def shortCommit = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
//       def customImage = docker.build("t0ster/kuber-ui:${shortCommit}")
//       customImage.push()
//       // sh "docker rmi t0ster/kuber-ui:${shortCommit}"
//     }
//   }
// }
def branch = BRANCH_NAME
def uiTag = branch
def functionsTag = branch
def seleniumTag = branch


podTemplate(
        containers: [
                containerTemplate(name: 'jnlp', image: 'jenkins/jnlp-slave'),
                containerTemplate(name: 'builder', image: 't0ster/build-deploy', command: 'cat', ttyEnabled: true, envVars: [
                    envVar(key: 'DOCKER_HOST', value: 'tcp://dind:2375')
                ]),
                containerTemplate(name: 'selenium', alwaysPullImage: true, image: "t0ster/kuber-selenium:${seleniumTag}", command: 'cat', ttyEnabled: true, envVars: [
                    envVar(key: 'SELENIUM_HOST', value: 'zalenium'),
                    envVar(key: 'BASE_URL', value: "http://${branch}.kuber.35.246.75.225.nip.io"),
                    envVar(key: 'BUILD', value: "kuber-ui-${BUILD_ID}"),
                ])
        ],
        serviceAccount: 'jenkins-operator-jenkins'
) {
    node(POD_LABEL) {
        stage('Build') {
            echo 'Build...'
            sh 'env'
            container('builder') {
                checkout scm
                // git branch: uiTag, changelog: false, poll: false, url: 'https://github.com/t0ster/kuber-ui.git'
                docker.withRegistry('', 'dockerhub-registry') {
                  def customImage = docker.build("t0ster/kuber-ui:${uiTag}")
                  customImage.push()
                //   sh "docker rmi t0ster/kuber-functions:master"
                }
            }
        }
        stage('Deploy') {
            def patchOrg = """
                {
                    "release": "kuber-stg",
                    "repo": "https://github.com/t0ster/kuber.git",
                    "path": "charts/kuber-stack",
                    "namespace": "stg",
                    "values": {
                        "host": "${branch}.kuber.35.246.75.225.nip.io".
                        "ui": {
                            "image": {
                                "tag": ${uiTag},
                                "pullPolicy": "Always",
                                "release": "kuber-ui-${BUILD_ID}"
                            }
                        },
                        "functions": {
                            "image": {
                                "tag": ${functionsTag},
                                "pullPolicy": "Always",
                                "release": "kuber-ui-${BUILD_ID}"
                            }
                        },
                    }
                }
            """
            def response = httpRequest acceptType: 'APPLICATION_JSON', contentType: 'APPLICATION_JSON', httpMode: 'POST', requestBody: patchOrg, url: "http://deployer-kuber-deployer.kube-system"
            def jsonObj = readJSON text: response.content
            echo jsonObj['result']
        }
        stage('Functional Test') {
            container('selenium') {
                try {
                    sh 'pytest /app --verbose --junit-xml reports/tests.xml'
                } finally {
                    junit testResults: 'reports/tests.xml'
                    echo "http://zalenium.35.246.75.225.nip.io/dashboard/?q=build:kuber-ui-${BUILD_ID}"
                }
            }
        }
    }
}
