export function getOpportunities({mainThreadTime, blockingTime,  transferSize, resourceSize, rtt, serverResponseTime}, numItems){
    const oppoutunities = {
        user: [],
        thirdParty: []
    }
    if(mainThreadTime/numItems > 50 || blockingTime > 0){
        oppoutunities.user.push('Remove unnecessary scripts')
        oppoutunities.user.push('Shift Scripts to web workers in order to improve')
        oppoutunities.thirdParty.push('Optimise scripts to run faster')
    }
    if(blockingTime > 0){
        oppoutunities.user.push('Try to keep tasks short')
        oppoutunities.thirdParty.push('Try to keep tasks short and fast, if not possible break them into many smaller ones')
    }
    if(transferSize/numItems > 50 * 1024){
        if(mainThreadTime/numItems > 50 ) {
            oppoutunities.user.push('Remove unnecessary scripts')
        } 
        if(resourceSize/ transferSize < 3 ){
            oppoutunities.thirdParty.push('Try to compress resources properly before transfering over the network')
            oppoutunities.user.push('Try hosting the scripts on personal server and compress them properly')
        }
    }
    if(rtt > 50){
        oppoutunities.thirdParty.push('Bring the servers closer to users to improve rtt')
        oppoutunities.user.push('Hosting scripts on personal servers can improve rtt')
    }
    if(serverResponseTime > 100){
        oppoutunities.thirdParty.push('Improve Server performance by scaling the resources and optimising code performance')
    }
    if(oppoutunities.thirdParty.length ===0 ){
        oppoutunities.thirdParty.push('Things are Pretty Optimised')
    }
    return oppoutunities
}

