const _pof = function(){
    const ONE_HOUR = 1000*60*60;
    const ONE_DAY = 24*ONE_HOUR;
    let timers = {
        "ManorFarm": {
            small1: {time: 0, food: 0, animalCount: 6}, //"food" refers to the amount of food available at "time"
            small2: {time: 0, food: 0, animalCount: 6},
            med1: {time: 0, food: 0, animalCount: 4},
            med2: {time: 0, food: 0, animalCount: 4},
            large1: {time: 0, food: 0, animalCount: 3},
            large2: {time: 0, food: 0, animalCount: 3},
            breeding: {time: 0, food: 0, animalCount: 4}
        },
        "Anachronia": {
            small: {time: 0, food: 0, animalCount: 6},
            medium: {time: 0, food: 0, animalCount: 4},
            large1: {time: 0, food: 0, animalCount: 3},
            large2: {time: 0, food: 0, animalCount: 3},
            breeding: {time: 0, food: 0, animalCount: 4}
        }
    }

    const animalAmounts = {
        small1: 6,
        small2: 6,
        med1: 4,
        med2: 4,
        large1: 3,
        large2: 3,
        small: 6,
        medium: 4,
        breeding: 4
    }


    const init = () => {
        loadTimersFromLocalStorage();

        $('.penAnimals').on('change', function(){
            const parent = $(this).parent();
            const penType = $(parent).attr('penType');

            const location = penType.split("_")[0];
            const pen = penType.split("_")[1];

            console.log($(this).val());
            timers[location][pen].animal = $(this).val();

            saveValuesToLocalStorage();
        });

        $('.penAnimalAmount').on('change', function(){
            const parent = $(this).parent();
            const penType = $(parent).attr('penType');

            const location = penType.split("_")[0];
            const pen = penType.split("_")[1];

            let quantity = parseInt($(this).val());
            if(isNaN(quantity)){
                $(this).val(0);
                alert("Animal amount must be a number!");
            }
            else if(quantity < 0){
                $(this).val(0);
                alert("Animal amount must be non-negative!");
            }
            else{
                timers[location][pen].animalCount = quantity;
                timers[location][pen].time = Date.now();

                saveValuesToLocalStorage();

                updateFoodTime(location,pen);
            }
        });

        $('.penFoodAmount').on('change', function(){
            const parent = $(this).parent();
            const penType = $(parent).attr('penType');

            const location = penType.split("_")[0];
            const pen = penType.split("_")[1];

            console.log(`${pen} at ${location}`);

            let quantity = parseInt($(this).val());
            console.log(quantity);
            if(isNaN(quantity)){
                $(this).val(0);
                alert("Food amount must be a number!");
            }
            else if(quantity < 0){
                $(this).val(0);
                alert("Food amount must be non-negative!");
            }
            else{
                timers[location][pen].food = quantity;
                timers[location][pen].time = Date.now();

                saveValuesToLocalStorage();

                updateFoodTime(location,pen);
            }
        });
    }

    const updateFoodTime = (location, pen) => {

        const quantity = timers[location][pen].food;
        const time = timers[location][pen].time;
        const animalCount = timers[location][pen].animalCount;

        const penRow = $(`.penRow[penType="${location}_${pen}"]`);
        const timeCell = $(penRow).find('.penFoodOutTimes');

        const expiryTime = time + ONE_HOUR*(1+Math.floor(quantity/animalCount));
        const timeDiff = Math.max(0,expiryTime-Date.now());
        const timeElapsed = Date.now() - time;
        const hoursElapsed = timeElapsed/ONE_HOUR;

        const foodRemain = ~~(quantity - animalCount*hoursElapsed);

        const expiryHours = timeDiff/ONE_HOUR;


        if(quantity > 0){

            $(timeCell).html(`${~~(expiryHours/24)}D ${~~expiryHours%24}H (${foodRemain})`);
            if(expiryTime - Date.now() < ONE_DAY){
                $(timeCell).addClass('soon');
                $(timeCell).removeClass('good');
                $(timeCell).removeClass('bad');
            }
            else{
                $(timeCell).addClass('good');
                $(timeCell).removeClass('bad');
                $(timeCell).removeClass('soon');
            }
        }
        else{
            $(timeCell).html("No food!");
            $(timeCell).addClass('bad');
            $(timeCell).removeClass('good');
            $(timeCell).removeClass('soon');
        }
        


    }

    const loadTimersFromLocalStorage = () => {
        let lsData = localStorage.getItem('POFTimers');
        if(lsData){
            lsData = JSON.parse(lsData);
            console.log(lsData);
            for(k in lsData["ManorFarm"]){
                timers["ManorFarm"][k] = {
                    time: lsData["ManorFarm"][k].time || 0,
                    food: lsData["ManorFarm"][k].food || 0,
                    animal: lsData["ManorFarm"][k].animal || "empty",
                    animalCount: lsData["ManorFarm"][k].animalCount || animalAmounts[k]
                }

                $(`.penRow[pentype="ManorFarm_${k}"] > .penAnimals`).val(timers["ManorFarm"][k].animal);
                $(`.penRow[pentype="ManorFarm_${k}"] > .penFoodAmount`).val(timers["ManorFarm"][k].food);
                $(`.penRow[pentype="ManorFarm_${k}"] > .penAnimalAmount`).val(timers["ManorFarm"][k].animalCount);

                updateFoodTime("ManorFarm",k);
            }

            for(k in lsData["Anachronia"]){
                timers["Anachronia"][k] = {
                    time: lsData["Anachronia"][k].time || 0,
                    food: lsData["Anachronia"][k].food || 0,
                    animal: lsData["Anachronia"][k].animal || "empty",
                    animalCount: lsData["Anachronia"][k].animalCount || animalAmounts[k]
                }

                $(`.penRow[pentype="Anachronia_${k}"] > .penAnimals`).val(timers["Anachronia"][k].animal);
                $(`.penRow[pentype="Anachronia_${k}"] > .penFoodAmount`).val(timers["Anachronia"][k].food);
                $(`.penRow[pentype="Anachronia_${k}"] > .penAnimalAmount`).val(timers["Anachronia"][k].animalCount);

                updateFoodTime("Anachronia",k);
            }
        }
        else{
            console.log("No existing data to load!");
        }
    }

    const saveValuesToLocalStorage = () => {
        console.log(timers);
        const asJSON = JSON.stringify(timers);
        localStorage.setItem('POFTimers',asJSON);
    }

    init();
}();
