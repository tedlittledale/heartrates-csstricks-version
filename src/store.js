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
  .actions(self => ({
    setSelectedAxes(val) {
      self.selectedAxes = val;
    },
    setUpScales({ width }) {
      self.ready = false;
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

      self.ready = true;
    }
  }))
  .views(self => ({
    getXAxis() {
      switch (self.selectedAxes) {
        case 0:
          return self.longevityXAxis();
          break;
        case 1:
        case 2:
          return self.weightXAxis();
          break;
      }
    },
    getYAxis() {
      switch (self.selectedAxes) {
        case 0:
        case 1:
          return self.heartYAxis();
          break;
        case 2:
          return self.longevityYAxis();
          break;
      }
    },
    getPoints() {
      switch (self.selectedAxes) {
        case 0:
          return self.longevityHeartratePoints();
          break;
        case 1:
          return self.weightHeartratePoints();
          break;
        case 2:
          return self.longevityWeightPoints();
          break;
      }
    },
    heartYAxis() {
      return self.heartScaleY.ticks(10).map(val => ({
        label: val,
        y: self.heartScaleY(val)
      }));
    },
    longevityYAxis() {
      return self.longevityScaleY.ticks(10).map(val => ({
        label: val,
        y: self.longevityScaleY(val)
      }));
    },
    longevityXAxis() {
      return self.longevityScaleX.ticks(10).map(val => ({
        label: val,
        x: self.longevityScaleX(val)
      }));
    },
    weightXAxis() {
      const f = format(',.2r');
      const f2 = format(',.2s');
      return [100, 1000, 10000, 100000, 1000000, 10000000, 100000000].map(
        val => ({
          label: val < 1001 ? val / 1000 : f2(val / 1000),
          x: self.weightScaleX(val)
        })
      );
    },
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
    longevityWeightPoints() {
      return self.animals.map(
        ({
          Creature,
          Longevity__Years_,
          Mass__grams_,
          Resting_Heart_Rate__BPM_
        }) => ({
          y: self.longevityScaleY(Longevity__Years_),
          x: self.weightScaleX(Mass__grams_),
          pulse: Math.round(1000 / (Resting_Heart_Rate__BPM_ / 60)),
          label: Creature
        })
      );
    },
    weightHeartratePoints() {
      return self.animals.map(
        ({ Creature, Mass__grams_, Resting_Heart_Rate__BPM_ }) => ({
          y: self.heartScaleY(Resting_Heart_Rate__BPM_),
          x: self.weightScaleX(Mass__grams_),
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
