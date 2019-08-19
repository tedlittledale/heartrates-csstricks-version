import { Provider } from 'mobx-react';
import { types, onSnapshot } from 'mobx-state-tree';
import { scaleLinear, scaleLog } from 'd3-scale';
import { format } from 'd3-format';
import { data } from './data';
import { type } from 'os';

const AnimalModel = types.model('AnimalModel', {
  Creature: types.string,
  Longevity__Years_: types.number,
  Mass__grams_: types.number,
  Resting_Heart_Rate__BPM_: types.number
});

const ChartModel = types
  .model('ChartModel', {
    animals: types.array(AnimalModel),
    maxHeartrate: types.maybeNull(types.number),
    minHeartrate: types.maybeNull(types.number),
    maxLongevity: types.maybeNull(types.number),
    minLongevity: types.maybeNull(types.number),
    maxWeight: types.maybeNull(types.number),
    minWeight: types.maybeNull(types.number),
    paddingAndMargins: types.frozen({
      paddingX: 30,
      paddingRight: 0,
      marginX: 30,
      marginY: 30,
      marginTop: 30,
      chartHeight: 500
    }),
    ready: false,
    selectedAxes: 0
  })
  .actions(self => ({
    addAnimals(animals) {
      self.animals = animals;
    },
    setSelectedAxes(val) {
      self.selectedAxes = val;
    },
    setUpScales({ width }) {
      let maxHeartrate = 0,
        minHeartrate = 0,
        maxLongevity = 0,
        minLongevity = 0,
        maxWeight = 0,
        minWeight = 0;
      const {
        paddingX,
        paddingRight,
        marginX,
        marginY,
        marginTop,
        chartHeight
      } = self.paddingAndMargins;
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
          minHeartrate =
            minHeartrate === 0
              ? parseInt(Resting_Heart_Rate__BPM_, 10)
              : Math.min(minHeartrate, parseInt(Resting_Heart_Rate__BPM_, 10));
          maxLongevity = Math.max(
            maxLongevity,
            parseInt(Longevity__Years_, 10)
          );
          minLongevity =
            minLongevity === 0
              ? parseInt(Longevity__Years_, 10)
              : Math.min(minLongevity, parseInt(Longevity__Years_, 10));
          maxWeight = Math.max(maxWeight, parseInt(Mass__grams_, 10));
          minWeight =
            minWeight === 0
              ? parseInt(Mass__grams_, 10)
              : Math.min(minWeight, parseInt(Mass__grams_, 10));
        }
      );
      self.heartScale = scaleLinear()
        .domain([maxHeartrate, minHeartrate])
        .nice(5)
        .range([marginTop, chartHeight - marginY - marginTop]);
      self.longevityScale = scaleLinear()
        .domain([minLongevity, maxLongevity])
        .nice(5)
        .range([paddingX + marginY, width - marginX - paddingX - paddingRight]);
      self.longevityScaleY = scaleLinear()
        .domain([maxLongevity, minLongevity])
        .nice(5)
        .range([marginTop, chartHeight - marginY - marginTop]);
      self.weightScale = scaleLog()
        .base(2)
        .domain([minWeight, maxWeight])
        .range([paddingX + marginY, width - marginX - paddingX - paddingRight]);
      self.ready = true;
      console.log('here', self.toJSON());
    }
  }))
  .views(self => ({
    animalsSorted() {
      return self.animals
        .map(({ Creature }) => Creature)
        .sort((a, b) => {
          const name = a.indexOf(' ') === -1 ? a : a.split(' ')[1];
          const name2 = b.indexOf(' ') === -1 ? b : b.split(' ')[1];
          return name.toUpperCase() < name2.toUpperCase() ? -1 : 1;
        });
    },
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
    getPoints() {
      switch (self.selectedAxes) {
        case 0:
          return self.longevityHeartratePoints;
          break;
        case 1:
          return self.weightHeartratePoints;
          break;
        case 2:
          return self.longevityWeightPoints;
          break;
      }
    },
    get heartYAxis() {
      return self.heartScale.ticks(10).map(val => ({
        label: val,
        y: self.heartScale(val)
      }));
    },
    get longevityYAxis() {
      return self.longevityScaleY.ticks(10).map(val => ({
        label: val,
        y: self.longevityScaleY(val)
      }));
    },
    get longevityXAxis() {
      return self.longevityScale.ticks(10).map(val => ({
        label: val,
        x: self.longevityScale(val)
      }));
    },
    get weightXAxis() {
      const f = format(',.2r');
      const f2 = format(',.2s');
      return [100, 1000, 10000, 100000, 1000000, 10000000, 100000000].map(
        val => ({
          label: val < 1001 ? val / 1000 : f2(val / 1000),
          x: self.weightScale(val)
        })
      );
    },
    get longevityHeartratePoints() {
      return self.animals.map(
        ({
          Creature,
          Longevity__Years_,
          Mass__grams_,
          Resting_Heart_Rate__BPM_,
          ...rest
        }) => ({
          y: self.heartScale(Resting_Heart_Rate__BPM_),
          x: self.longevityScale(Longevity__Years_),
          pulse: Math.round(1000 / (Resting_Heart_Rate__BPM_ / 60)),
          label: Creature
        })
      );
    },
    get longevityWeightPoints() {
      return self.animals.map(
        ({
          Creature,
          Longevity__Years_,
          Mass__grams_,
          Resting_Heart_Rate__BPM_,
          ...rest
        }) => ({
          y: self.longevityScaleY(Longevity__Years_),
          x: self.weightScale(Mass__grams_),
          pulse: Math.round(1000 / (Resting_Heart_Rate__BPM_ / 60)),
          label: Creature
        })
      );
    },
    get weightHeartratePoints() {
      return self.animals.map(
        ({
          Creature,
          Longevity__Years_,
          Mass__grams_,
          Resting_Heart_Rate__BPM_
        }) => ({
          y: self.heartScale(Resting_Heart_Rate__BPM_),
          x: self.weightScale(Mass__grams_),
          pulse: Math.round(1000 / (Resting_Heart_Rate__BPM_ / 60)),
          label: Creature
        })
      );
    }
  }));

const Store = types.model('Store', {
  chartModel: ChartModel
});
console.log([data]);
const store = Store.create({
  chartModel: { animals: data }
});

export default store;
