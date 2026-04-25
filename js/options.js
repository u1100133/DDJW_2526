import {$} from "../library/jquery-4.0.0.slim.module.min.js";

var options = function() {
    const default_options = {
        pairs: 2,
        difficulty: 'normal',
        groupSize: 2,
        startLevel: 1
    } 

    var pairs = $('#pairs');
    var difficulty = $('#dif');
    var groupSize = $('#groupSize');
    var startLevel = $('#startLevel');
    
    var savedOptions = localStorage.options && JSON.parse(localStorage.options);
    var currentOptions = Object.create(default_options);

    if (savedOptions) { //Carreguem opcions si ja existeixen
        if (savedOptions.pairs) currentOptions.pairs = savedOptions.pairs;
        if (savedOptions.difficulty) currentOptions.difficulty = savedOptions.difficulty;
        if (savedOptions.groupSize) currentOptions.groupSize = savedOptions.groupSize;
        if (savedOptions.startLevel) currentOptions.startLevel = savedOptions.startLevel;
    }
    pairs.val(currentOptions.pairs);
    difficulty.val(currentOptions.difficulty);
    groupSize.val(currentOptions.groupSize);
    startLevel.val(currentOptions.startLevel);

    pairs.on('change', function(){ currentOptions.pairs = pairs.val(); });
    difficulty.on('change', function(){ currentOptions.difficulty = difficulty.val(); });
    groupSize.on('change', function(){ currentOptions.groupSize = groupSize.val(); }); 
    startLevel.on('change', function(){ currentOptions.startLevel = startLevel.val(); });

    return {
        applyChanges: function(){
            localStorage.options = JSON.stringify(currentOptions);
        },
        defaultValues: function(){
            currentOptions.pairs = default_options.pairs;
            currentOptions.difficulty = default_options.difficulty;
            currentOptions.groupSize = default_options.groupSize;
            currentOptions.startLevel = default_options.startLevel;
            pairs.val(currentOptions.pairs);
            difficulty.val(currentOptions.difficulty);
            groupSize.val(currentOptions.groupSize);
            startLevel.val(currentOptions.startLevel);
        }
    }
}();

$('#default').on('click', function(){
    options.defaultValues();
})

$('#apply').on('click', function(){
    options.applyChanges();
    location.assign("../");
});
