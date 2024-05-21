function checkMaintenanceTime() {
    var now = new Date();
    var hours = now.getHours();
    
    //block user access system from 23h pm to 5h am
    if (hours >= 23 || hours < 5) {
        window.location.href = 'Maintainance.html'
    }

    //lúc lên thuyết trình set lại >=7 and < 11 demo
}

checkMaintenanceTime();