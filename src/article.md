# Using Mobx-state-tree to build charts

In this tutorial I will run through how to use Mobx-state-tree (MST) to manage and manipulate a dataset to make it a breeze to build an interactive custom chart.

The chart we are building is visible in the code box below. We will use d3.js scale functions but the chart itself is rendered simple using svg elements within JSX. I don’t know of any chart library that has an option for flashing hamster points so this is a great example of why it’s great, and not as hard as you might think, to create your own hand cranked, artisan if you will, charts.

<iframe src="https://codesandbox.io/embed/mobx-state-tree-chart-article-88ppe?fontsize=14&module=%2Fsrc%2FheartrateChart.js&view=preview" title="Mobx-state-tree chart article" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" style="width:100%; height:750px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

I’ve been building charts using d3 for over 10 years and while I love how powerful it is, I’ve always found that when I build complex visualisations my code can end up being unwieldy and hard to maintain. MST has changed all that by completely by providing an elegant way to separate the data handling from the rendering. My hope for this article is that it will encourage you to give it a spin.

## A brief intro to MST?

First of all, I’ve give you a quick overview of what a MST model looks like. This isn’t an in depth tutorial on all things Mobx, I just want to show the basics because, really, that’s all you need 90% of the time.

Below is a sandbox with the code for simple store for a todo list built in MST. Take a quick look and then I’ve explain what each section does.

<iframe src="https://codesandbox.io/embed/todo-store-uc3z1?fontsize=14&module=%2Fsrc%2Findex.js" title="Mobx-state-tree chart article" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

First of all the shape of the object is defined with typed definitions of the attribute of the model. In plain english, this means an instance of Todo model must have a title, which must be a string and will default to having a done attribute of false.

    .model("Todo", {
        title: types.string,
        done: false //this is equivalent to types.boolean that defaults to false
      })

Next you have the view functions and action functions. View functions are ways to access calculated values based on data within the model, without making any changes to the data held by the model. You can think of them as read-only functions.

    .views(self => ({
        outstandingTodoCount() {
          return self.todos.length - self.todos.filter(t => t.done).length;
        }
      }))

Action functions on the other hand allow you to safely update the data. This is always done in the background a non-mutable way.

    .actions(self => ({
        addTodo(title) {
          self.todos.push({
            id: Math.random(),
            title
          });
        }
      }));

Finally we create a new instance of the store

    const todoStore = TodoStore.create({
      todos: [
        {
          title: "foo",
          done: false
        }
      ]
    });

To show the store in action I’ve added a couple of console.logs to show the output of outStandingTodoCount() before and after triggering the toggle function of the first instance of a Todo.

    console.log(todoStore.outstandingTodoCount()); // outputs: 1
    todoStore.todos[0].toggle();
    console.log(todoStore.outstandingTodoCount()); // outputs: 0

As you can see, MST gives us data structure that allows us to easily access and manipulate data. More importantly it’s structure is very intuitive and the code is easy to read at a glance, not a reducer in sight!

Ok, so now we have a bit of background on what MST looks like I will show you how to use it to create a store to manages data for a chart.

I will start with the chart JSX thought as it’s much easier to build the store once you know what data you need for the chart.

## The Chart React Component

Let’s look at the JSX which renders the chart.

<iframe src="https://codesandbox.io/embed/mobx-state-tree-chart-article-88ppe?fontsize=14&module=%2Fsrc%2FheartrateChart.js&view=editor" title="Mobx-state-tree chart article" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

The first thing to note is that we are using styled-components to organise our css so if you aren’t familiar I’d recommend you take a look at their docs.

First of all we are rendering the dropdown which changes the axes for the chart. This is a fairly simple html dropdown wrapped in a styled component. The thing to note is that this is a [controlled input](https://www.robinwieruch.de/react-controlled-components/), with the state set using the selectedAxes value from our model (we’ll look at this later)

    <select
                    onChange={e =>
                      model.setSelectedAxes(parseInt(e.target.value, 10))
                    }
                    defaultValue={model.selectedAxes}
                  >

We then have the chart itself. I’ve split up the Axes and Points in to their own components which live in a separate file. First of all this really helps with maintainability of the the code, keeping each file nice and small. But on top of this it means we can reuse the Axes if we wanted to have a line charts instead of points. This really pays off when working on large projects with multiple types of chart. Finally it makes it easy to test the components in isolation, both programatically and manually within a living styleguide.

    {model.ready ? (
                <div>
                  <Axes
                    yTicks={model.getYAxis()}
                    xTicks={model.getXAxis()}
                    xLabel={xAxisLabels[model.selectedAxes]}
                    yLabel={yAxisLabels[model.selectedAxes]}
                  ></Axes>
                  <Points points={model.getPoints()}></Points>
                </div>
              ) : (
                <Loading></Loading>
              )}

In the sandbox try commenting out the Axes or Points components to see show they work independently of each other.

Finally wrap the component with a observer function. This means that any changes in the model will trigger a re-render.

    export default observer(HeartrateChart);

Next let’s take a look at the Axes component:

<iframe src="https://codesandbox.io/embed/mobx-state-tree-chart-article-88ppe?fontsize=14&module=%2Fsrc%2FAxes.js&view=editor" title="Mobx-state-tree chart article" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

As you can see we have an XAxis and a YAxis. Each has a label and a set of ticks. We will look at how these ticks are created in the model later but here you should note that for each axes is made up of a set of ticks, generated by mapping over an array of objects with a label and either an x or y value, depending on which axis we are rendering.

Try changing some of the attribute values for the elements and see what happens / breaks. For example try changing the line element in the YAxis to the following `<line x1={30} x2="95%" y1={0} y2={y} />`. The best way to learn how to build with svg elements is to experiment and break things 🙂 .

Ok, that’s half of the chart done, now we’ll look at the Points component.

<iframe src="https://codesandbox.io/embed/mobx-state-tree-chart-article-88ppe?fontsize=14&module=%2Fsrc%2FPoints.js&view=editor" title="Mobx-state-tree chart article" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Each point on the chart is actually composed of two things, an svg image and an styled html div ‘blinker’ which sits behind the image. I try to use svg elements wherever possible as positioning in svg is more precise but the animation was easier to achieve with html so I’ve mixed and matched here.

Try commenting out the svg code and then the html code to see what happens.

This time the the model has to provide an array of point objects which gives us four properties: `x` and `y` values used to position the point on the graph, a `label` for the point (the name of the animal) and `pulse`, which is the duration of the pulse animation for each animal. Hopefully this all seems intuitive and logical.

Again, try fiddling with attribute values to see what changes / breaks. You can try setting the `y` attribute of the `image` to 0. Trust me, this is a much less intimidating way to learn than reading the W3C specification for an svg image element!

So hopefully you now understand how we are rendering the chart in React. Now it’s just a case of creating a model with the appropriate actions to generate the points and ticks data we need to loop over in the JSX.

## Creating our store

Here is the complete code for the store:

<iframe src="https://codesandbox.io/embed/mobx-state-tree-chart-article-88ppe?fontsize=14&module=%2Fsrc%2Fstore.js&view=editor" title="Mobx-state-tree chart article" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

I’ll break down the code into the three parts I talked about earlier:

1. defining the attributes of the model
2. Defining the actions
3. Defining the views

## Attributes

Everything we define here is accessible externally as a property of the instance of the model, and if using an `observable` wrapped component, any changes to these properties will trigger a rerender.

    .model('ChartModel', {
        animals: types.array(AnimalModel),
        paddingAndMargins: types.frozen({
          paddingX: 30,
          paddingRight: 0,
          marginX: 30,
          marginY: 30,
          marginTop: 30,
          chartHeight: 500
        }),
        ready: false, // means a types.boolean that defaults to false
        selectedAxes: 0 // means a types.number that defaults to 0
      })

Each animal has 4 data points, a name, a resting heart rate, a weight and a longevity.

    const AnimalModel = types.model('AnimalModel', {
      Creature: types.string,
      Longevity__Years_: types.number,
      Mass__grams_: types.number,
      Resting_Heart_Rate__BPM_: types.number
    });

## Actions

We only have two actions. The first, setSelectedAxes is simple, this is called when you change the dropdown menu and updates the selectedAxes attribute which dictates what data gets used to render the axes.

        setSelectedAxes(val) {
          self.selectedAxes = val;
        },

The setUpScales action requires a bit more explanation. This function is called just after the chart component mounts, within a `useEffect` hook function, or after the window is resized. It accepts an object with the width of the dom element that contains the element. This allows us to set up the scale functions for each axis to fill the full width available. I will explain the scale functions shortly.

In order to set up scale functions we need to calculate the maximum value for each data type, so the first thing we do is loop over the animals to calculate these maximum and minimum values. We can use zero as the minimum value for any scale we want to start at zero.

    ...
          self.animals.forEach(
            ({
              Creature,
              Longevity__Years_,
              Mass__grams_,
              Resting_Heart_Rate__BPM_,
              ...rest
            }) => {
              maxHeartrate = Math.max(
                maxHeartrate,
                parseInt(Resting_Heart_Rate__BPM_, 10)
              );
              maxLongevity = Math.max(
                maxLongevity,
                parseInt(Longevity__Years_, 10)
              );
              maxWeight = Math.max(maxWeight, parseInt(Mass__grams_, 10));
              minWeight =
                minWeight === 0
                  ? parseInt(Mass__grams_, 10)
                  : Math.min(minWeight, parseInt(Mass__grams_, 10));
            }
          );

         ...

Now we have this values we set up the scale functions. Here we’ll use the scaleLinear and scaleLog functions from d3.js. When you set these up you set up you specify the domain, which is the minimum and maximum input they can expect, and the range, which is the maximum and minimum output.

So for example I call `self.heartScaleY` with the `maxHeartrate` value, the output will be equal to marginTop, which makes sense as this will be at the very top of the chart. For longevity we have an two scale functions as this data will appear on the X axis or the Y axis depending on which option you choose from the dropdown.

          self.heartScaleY = scaleLinear()
            .domain([maxHeartrate, minHeartrate])
            .range([marginTop, chartHeight - marginY - marginTop]);
          self.longevityScaleX = scaleLinear()
            .domain([minLongevity, maxLongevity])
            .range([paddingX + marginY, width - marginX - paddingX - paddingRight]);
          self.longevityScaleY = scaleLinear()
            .domain([maxLongevity, minLongevity])
            .range([marginTop, chartHeight - marginY - marginTop]);
          self.weightScaleX = scaleLog()
            .base(2)
            .domain([minWeight, maxWeight])
            .range([paddingX + marginY, width - marginX - paddingX - paddingRight]);

Finally we set `self.ready` to be true as the the chart is now ready to be rendered.

## Views

For the views we have two sets of functions, the first set outputs the data needed to render the axis ticks, the second set outputs the data needed to render the points. We’ll take a look at the tick functions first.

There are only two tick functions that are actually called from the React app, getXAxis and getYAxis, and these simply return the output of other view functions depending on the value of `self.selectedAxes`.

    getXAxis() {
          switch (self.selectedAxes) {
            case 0:
              return self.longevityXAxis;
              break;
            case 1:
            case 2:
              return self.weightXAxis;
              break;
          }
        },
        getYAxis() {
          switch (self.selectedAxes) {
            case 0:
            case 1:
              return self.heartYAxis;
              break;
            case 2:
              return self.longevityYAxis;
              break;
          }
        },

If we take a look at the Axis functions themselves we can see they use a ticks method of the scale function. This returns an array of numbers suitable for an axis. We then map over the values to return the data we need for our axis component.

        heartYAxis() {
          return self.heartScaleY.ticks(10).map(val => ({
            label: val,
            y: self.heartScaleY(val)
          }));
        }
      ...

Try changing the value of the parameter for the ticks function to 5 and see how it affects the chart: self.heartScaleY.ticks(5)`.

Finally we have the view functions to return the data needed for the Points component.

If we take a look at `longevityHeartratePoints`, which return the point data for the Longevity vs Heart rate chart, we can see that we are looping over the array of `animals` and using the appropriate scale functions to get the x and y positions for the point. For the `pulse` attribute we use some maths to convert the beats per minute value of the heart rate into a value representing the duration of a single heartbeat in milliseconds.

    longevityHeartratePoints() {
          return self.animals.map(
            ({ Creature, Longevity__Years_, Resting_Heart_Rate__BPM_ }) => ({
              y: self.heartScaleY(Resting_Heart_Rate__BPM_),
              x: self.longevityScaleX(Longevity__Years_),
              pulse: Math.round(1000 / (Resting_Heart_Rate__BPM_ / 60)),
              label: Creature
            })
          );
        },

Finally at the end of the `store.js` file we create a Store model and then instantiate that store with the raw animal data. It is common pattern to always attach all your models to parent Store model which can then be accessed through a provider at top level if needed.

    const Store = types.model('Store', {
      chartModel: ChartModel
    });
    const store = Store.create({
      chartModel: { animals: data }
    });
    export default store;

And that is it.

This is by no means the only way to organise data to build charts in JSX but I have found it to be incredibly effective. I’ve have used this structure and stack in the wild to build a library of custom charts for a big corporate client and was blown away with how nicely MST worked for this purpose.
