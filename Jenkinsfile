pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                echo "Pulling latest code..."
                git credentialsId: 'github-credentials',
                    url: 'https://github.com/Amanrai503/Agripulse.git',
                    branch: 'main'
            }
        }

        stage('Stop Old Containers') {
            steps {
                echo "Stopping existing containers..."
                sh 'docker compose down || true'
            }
        }

        stage('Build Images') {
            steps {
                echo "Building all Docker images..."
                sh 'docker compose build --no-cache'
            }
        }

        stage('Start Services') {
            steps {
                echo "Starting all services..."
                sh 'docker compose up -d'
            }
        }

        stage('Verify') {
            steps {
                echo "Checking containers are running..."
                sh 'docker compose ps'
            }
        }

    }

    post {
        success {
            echo "✅ Agripulse is live!"
        }
        failure {
            echo "❌ Build failed. Printing logs..."
            sh 'docker compose logs --tail=50 || true'
        }
    }
}