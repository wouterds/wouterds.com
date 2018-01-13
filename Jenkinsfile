import static Constants.*

class Constants {
  static final REPO = 'internal-wouterdeschuyter-website'
  static final DOCKER_FOLDER = '~/docker/projects/' + REPO
  static final SERVER = 'server03.wouterdeschuyter.be'
}

node {
  try {
    stage('Checkout') {
      sh 'printenv'
      checkout scm
    }

    stage('Clean') {
      sh 'make clean'
    }

    stage('Dependencies') {
      sh 'make dependencies'
    }

    stage('Lint') {
      sh 'make lint'
    }

    stage('Build') {
      sh 'make build'
    }

    stage('Tests') {
      sh 'make test-unit'
    }

    stage('Deploy') {
      if (!env.BRANCH_NAME.equals('master') && !env.BRANCH_NAME.equals('develop')) {
        sh 'echo Not master or develop branch, skip deploy.'
        return
      }

      // Push images to registry
      sh 'echo Pushing version'
      sh 'make push-latest'

      if (env.BRANCH_NAME.equals('master')) {
        sh 'echo Deploying production'
        deployProduction();
      }

      if (env.BRANCH_NAME.equals('develop')) {
        sh 'echo Deploying staging'
        deployStaging();
      }
    }
  } catch (e) {
    throw e
  } finally {
    // Clean up
    cleanWorkspace()
  }
}

def deployProduction() {
}

def deployStaging() {
  def folder = DOCKER_FOLDER + '-stag';

  sh 'ssh wouterds@'+SERVER+' "mkdir -p '+folder+'"'
  sh 'ssh wouterds@'+SERVER+' "mkdir -p '+folder+'/logs && chmod 777 '+folder+'/logs"'
  sh 'ssh wouterds@'+SERVER+' "mkdir -p '+folder+'/media && chmod 777 '+folder+'/media"'

  sh 'scp docker/docker-compose.yml wouterds@'+SERVER+':'+folder+'/docker-compose.yml'
  sh 'scp docker/docker-compose-stag.yml wouterds@'+SERVER+':'+folder+'/docker-compose-stag.yml'
  sh 'scp docker/docker.env wouterds@'+SERVER+':'+folder+'/docker.env'

  sh 'ssh wouterds@'+SERVER+' "cd '+folder+'; docker-compose -f docker-compose.yml -f docker-compose-stag.yml pull"'
  sh 'ssh wouterds@'+SERVER+' "cd '+folder+'; docker-compose -f docker-compose.yml -f docker-compose-stag.yml up -d"'

  sh 'ssh wouterds@'+SERVER+' "docker exec internalwouterdeschuyterwebsitestag_php-fpm_1 php composer.phar migrations:migrate"'
}

def cleanWorkspace() {
  sh 'echo "Cleaning up workspace.."'
  deleteDir()
}
