chSmoother
==========

A custom binding in KnockoutJS to display the change of a value from 0 to 100 for instance, by displaying by the intermediate values 10 20 etc. until 100, according to the config you give.

```html
<div data-bind="smoother: Money, raising: 'success', lowering: 'danger'">
	$ <span data-bind="text: SmoothValue"></span>
</div>
```

Available options :
- smootherSpeed (in ms): determine how much time the binding will take to do the full change. (default: 500)
- smootherInterval (in ms): determine how much time between every minor change (default: 10)
- raising: class name to set when the value is raising
- lowering: class name to set when the value is lowering
