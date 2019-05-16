# kurtis 0.0.1-SNAPSHOT 

   USAGE

     kurtis <command> [options]

   COMMANDS

     aws-cloudwatch-logs                                                                                              
     aws-codedeploy-applications-list                                                                                 
     aws-codedeploy-deployments-list                                                                                  
     aws-codedeploy-role-create                                                                                       
     aws-codedeploy-role-get                                                                                          
     aws-config-profiles-activate                     List all AWS profiles                                           
     aws-config-profiles-add                          List all AWS profiles                                           
     aws-config-profiles-get-active                   Obtain the activated AWS profile                                
     aws-config-profiles-get                          List all AWS profiles                                           
     aws-config-profiles-list                         List all AWS profiles                                           
     aws-ecr-images-clean                             Clean Docker images by removing all dangling images             
     aws-ecr-images-list                                                                                              
     aws-ecr-images-remove                                                                                            
     aws-ecs-clusters-create                                                                                          
     aws-ecs-clusters-list                                                                                            
     aws-ecs-tasks-definitions-revisions-list                                                                         
     aws-ecs-tasks-definitions-revisions-remove                                                                       
     aws-ecs-tasks-status                                                                                             
     aws-load-balancers-status                                                                                        
     aws-snapshot                                     Take a snapshot from the AWS environment                        
     aws-vpc-create-public                                                                                            
     docker-containers-clean                          Clean Docker containers by removing all exited images           
     docker-images-clean                              Clean Docker images by removing all dangling images             
     docker-images-remove                             Delete a bunch of Docker images by prefix                       
     gcloud-defaults-update                                                                                           
     gcloud-k8s-create                                                                                                
     gcloud-k8s-get-credentials                                                                                       
     gcloud-k8s-list                                                                                                  
     gcloud-k8s-remove                                                                                                
     gcloud-k8s-resize                                                                                                
     gcloud-projects-list                                                                                             
     gcloud-projects-remove                                                                                           
     git-branches-clean-all-but-develop               Clean all Git branches that has been already merged into develop
     git-branches-clean-merged                        Clean all Git branches that has been already merged into develop
     git-branches-list-no-merged                      List Git branches that has not been merged into develop         
     git-release-finish                                                                                               
     git-release-init                                                                                                 
     github-branches-list                             List all merged branches                                        
     github-branches-remove                           List all merged branches                                        
     github-pull-request-pending-reviews              List all pending pull requests                                  
     github-pull-request-set-as-reviewed              Set pull request as reviewed                                    
     idea-clean-files                                 Remove all IDEA files                                           
     java-maven-versions-update-to-next               Update the pom.xml release                                      
     java-maven-versions-update-to-release            Update the pom.xml release                                      
     java-scaffolding-spring-data-rest                                                                                
     java-scaffolding-vertx                                                                                           
     json-to-csv                                                                                                      
     k8s-contexts-list                                                                                                
     k8s-contexts-remove                                                                                              
     k8s-namespaces-list                                                                                              
     k8s-namespaces-set-preferred                                                                                     
     photos-list                                                                                                      
     photos-thumbnails-list                                                                                           
     photos-thumbnails-sync                                                                                           
     help <command>                                   Display help for a specific command                             

   GLOBAL OPTIONS

     -h, --help         Display help                                      
     -V, --version      Display version                                   
     --no-color         Disable colors                                    
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages
