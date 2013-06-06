/*

Example :
<div data-bind="smoother: Money, raising: 'success', lowering: 'danger'">
	$ <span data-bind="text: SmoothValue"></span>
</div>

Available options :
- smootherSpeed (in ms): determine how much time the binding will take to do the full change. (default: 500)
- smootherInterval (in ms): determine how much time between every minor change (default: 10)
- raising: class name to set when the value is raising
- lowering: class name to set when the value is lowering
*/

ko.bindingHandlers['smoother'] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // original value
        var value = ko.utils.unwrapObservable(valueAccessor());

        // stock the current value for use in the update (to know the delta between current and previous)
        ko.utils.domData.set(element, 'previousValue', value);
        ko.bindingHandlers['smoother'].updateChildContext(element, bindingContext, value);
        return { controlsDescendantBindings: true };
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // params
        var totalTime = allBindingsAccessor().smootherSpeed || 500;
        var interval = allBindingsAccessor().smootherInterval || 10;
        var raisingClass = allBindingsAccessor().raising;
        var loweringClass = allBindingsAccessor().lowering;
        
        // previous value
        var source = ko.utils.domData.get(element, 'previousValue');

        // new value
        var target = ko.utils.unwrapObservable(valueAccessor());;
               
        // number of iterations (of raising/lowering) we are going to do 
        var count = totalTime / interval;

        // computes the delta we are going to add to the value at each iteration
        var delta = (target - source) / count;

        // add the raising/lowering class if given
        $(element).addClass(delta > 0 ? raisingClass : loweringClass);

        // define the function that is going to call at each iteration
        var incrementerFn = function () {
            source += delta;

            // stock the current value for later use (to know the delta between current and previous)
            ko.utils.domData.set(element, 'previousValue', target);

            // update child context
            ko.bindingHandlers['smoother'].updateChildContext(element, bindingContext, source);

            // check if there is still a difference between the current value and the target (using a minor float error)
            if (Math.abs(source - target) > 0.01) {
                // start the next iteration in [interval] ms
                setTimeout(incrementerFn, interval);
            } else {
                // we are done, no more timer, remove the raising/lowering class
                $(element).removeClass(raisingClass).removeClass(loweringClass)
            }   
        };

        // start the first iteration in [interval] ms
        setTimeout(incrementerFn, interval);
    },

    // update the child context with the given value
    updateChildContext: function(element, bindingContext, value) {
        var tChildContext = bindingContext.createChildContext({ SmoothValue: Math.round(value) });
        ko.applyBindingsToDescendants(tChildContext, element);
    }
};
