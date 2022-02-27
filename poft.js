const _pof = function(){
    const ONE_HOUR = 1000*60*60;
    const ONE_DAY = 24*ONE_HOUR;
    let timers = {
        "ManorFarm": {
            small1: {time: 0, food: 0}, //"food" refers to the amount of food available at "time"
            small2: {time: 0, food: 0},
            med1: {time: 0, food: 0},
            med2: {time: 0, food: 0},
            large1: {time: 0, food: 0},
            large2: {time: 0, food: 0},
            breeding: {time: 0, food: 0}
        },
        "Anachronia": {
            small: {time: 0, food: 0},
            medium: {time: 0, food: 0},
            large1: {time: 0, food: 0},
            large2: {time: 0, food: 0},
            breeding: {time: 0, food: 0}
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
            else if(quantity == 0){
                timers[location][pen].food = 0;
                timers[location][pen].time = Date.now();
                const timeCell = $(parent).find('.penFoodOutTimes');
                $(timeCell).html("NO FOOD!");
                $(timeCell).addClass('bad');
                $(timeCell).removeClass('good');
                $(timeCell).removeClass('soon');

                saveValuesToLocalStorage();
            }
            else{
                timers[location][pen].food = quantity;
                timers[location][pen].time = Date.now();

                const timeCell = $(parent).find('.penFoodOutTimes');
                const expiryTime = Date.now() + ONE_HOUR*(1+Math.floor(quantity/animalAmounts[pen]));
                const expiryHours = ONE_HOUR*(1+Math.floor(quantity/animalAmounts[pen]))/(1000*3600);
    
                $(timeCell).html(`${~~(expiryHours/24)}D ${~~expiryHours%24}H`);

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

                saveValuesToLocalStorage();
            }
        });
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
                }

                $(`.penRow[pentype="ManorFarm_${k}"] > .penAnimals`).val(timers["ManorFarm"][k].animal);
                $(`.penRow[pentype="ManorFarm_${k}"] > .penFoodAmount`).val(timers["ManorFarm"][k].food);

                const expiryTime = timers["ManorFarm"][k].time + ONE_HOUR*(1+Math.floor(timers["ManorFarm"][k].food/animalAmounts[k]));
                const expiryHours = (timers["ManorFarm"][k].time + ONE_HOUR*(1+Math.floor(timers["ManorFarm"][k].food/animalAmounts[k])) - Date.now())/(1000*3600);

                const timeCell =  $(`.penRow[pentype="ManorFarm_${k}"] > .penFoodOutTimes`);


                
                if(Date.now() > expiryTime){
                    $(timeCell).removeClass('soon');
                    $(timeCell).removeClass('good');
                    $(timeCell).addClass('bad');
                }
                else if(expiryTime - Date.now() < ONE_DAY){
                    $(timeCell).addClass('soon');
                    $(timeCell).removeClass('good');
                    $(timeCell).removeClass('bad');
                }
                else{
                    $(timeCell).addClass('good');
                    $(timeCell).removeClass('bad');
                    $(timeCell).removeClass('soon');
                }

                if(timers["ManorFarm"][k].food > 0){
                    $(timeCell).html(`${~~(expiryHours/24)}D ${~~expiryHours%24}H`);
                }
                else{
                    $(timeCell).html("NO FOOD!");
                    $(timeCell).removeClass('soon');
                    $(timeCell).removeClass('good');
                    $(timeCell).addClass('bad');
                }
            }

            for(k in lsData["Anachronia"]){
                timers["Anachronia"][k] = {
                    time: lsData["Anachronia"][k].time || 0,
                    food: lsData["Anachronia"][k].food || 0,
                    animal: lsData["Anachronia"][k].animal || "empty",
                }

                $(`.penRow[pentype="Anachronia_${k}"] > .penAnimals`).val(timers["Anachronia"][k].animal);
                $(`.penRow[pentype="Anachronia_${k}"] > .penFoodAmount`).val(timers["Anachronia"][k].food);

                const expiryTime = timers["Anachronia"][k].time + ONE_HOUR*(1+Math.floor(timers["Anachronia"][k].food/animalAmounts[k]));
                const expiryHours = (timers["Anachronia"][k].time + ONE_HOUR*(1+Math.floor(timers["Anachronia"][k].food/animalAmounts[k])) - Date.now())/(1000*3600);

                const timeCell =  $(`.penRow[pentype="Anachronia_${k}"] > .penFoodOutTimes`);


                
                if(Date.now() > expiryTime){
                    $(timeCell).removeClass('soon');
                    $(timeCell).removeClass('good');
                    $(timeCell).addClass('bad');
                }
                else if(expiryTime - Date.now() < ONE_DAY){
                    $(timeCell).addClass('soon');
                    $(timeCell).removeClass('good');
                    $(timeCell).removeClass('bad');
                }
                else{
                    $(timeCell).addClass('good');
                    $(timeCell).removeClass('bad');
                    $(timeCell).removeClass('soon');
                }

                if(timers["Anachronia"][k].food > 0){
                    $(timeCell).html(`${~~(expiryHours/24)}D ${~~expiryHours%24}H`);
                }
                else{
                    $(timeCell).html("NO FOOD!");
                    $(timeCell).removeClass('soon');
                    $(timeCell).removeClass('good');
                    $(timeCell).addClass('bad');
                }
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
