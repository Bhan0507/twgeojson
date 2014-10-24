// Generated by LiveScript 1.2.0
var width, height, vote, villageName, svg;
width = window.innerWidth * 0.8;
height = window.innerHeight - 10;
vote = d3.map();
villageName = d3.map();
svg = d3.select('body').append('svg').attr('width', width).attr('height', height);
d3.json("tw.json", function(tw){
  return d3.csv("districts.csv", function(it){
    return villageName.set(it.ivid, {
      name: it.name,
      town: it.town,
      county: it.county
    });
  }, function(){
    return d3.csv("election2009.csv", function(it){
      return vote.set(it.ivid, {
        blue: +it.blue,
        green: +it.green
      });
    }, function(){
      var val, valWin, colorWin, max, c, min, scale, scale2, quantize, proj, villages, path, g, partOf, wanted, zoomin, setWanted, show, x$, zoomTo, y$;
      val = function(it){
        if (it) {
          return it.blue + it.green;
        } else {
          return 0;
        }
      };
      valWin = function(it){
        if (it) {
          return Math.abs(it.blue - it.green);
        } else {
          return 0;
        }
      };
      colorWin = function(it){
        if (it) {
          if (it.blue > it.green) {
            return 'blue';
          } else {
            return 'green';
          }
        } else {
          return 'white';
        }
      };
      max = d3.max((function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = vote.values()).length; i$ < len$; ++i$) {
          c = ref$[i$];
          results$.push(val(c));
        }
        return results$;
      }()));
      min = d3.min((function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = vote.values()).length; i$ < len$; ++i$) {
          c = ref$[i$];
          results$.push(val(c));
        }
        return results$;
      }()));
      console.log(min, max);
      scale = d3.scale.log().domain([min + 1, max + 1]).range([0, 9]);
      scale2 = d3.scale.sqrt().domain([min, max]).range([0, 10]);
      quantize = function(it){
        return "q" + ~~scale(it) + "-9";
      };
      proj = mtw();
      villages = topojson.feature(tw, tw.objects['villages']);
      path = d3.geo.path().projection(proj);
      g = svg.append('g').attr('class', 'villages');
      partOf = function(name){
        return function(it){
          return 0 === (it != null ? it.indexOf(name) : void 8);
        };
      };
      setWanted = function(it){
        var selected;
        wanted = partOf(it);
        zoomin = villages.features.filter(function(it){
          var ref$;
          return wanted((ref$ = it.properties) != null ? ref$.ivid : void 8);
        });
        selected = topojson.mesh(tw, tw.objects['villages'], function(a, b){
          var f, aa, g, bb;
          f = topojson.feature(tw, a);
          aa = wanted(f.properties.ivid);
          if (a === b && aa) {
            return true;
          }
          g = topojson.feature(tw, b);
          bb = wanted(g.properties.ivid);
          return a !== b && aa !== bb;
        });
        g.selectAll('path.selected').remove();
        return g.append('path').datum(selected).attr('class', 'selected').attr('d', path);
      };
      show = function(it){
        var v, cnt, total;
        v = villageName.get(it.properties.ivid);
        cnt = vote.get(it.properties.ivid);
        total = val(cnt);
        d3.select('h3.village-name').text([v['county'], v['town'], v['name']].join(''));
        d3.select('span.village-blue').text(total ? cnt.blue + " (" + Math.round(100 * cnt.blue / total) + "%)" : '');
        d3.select('span.village-green').text(total ? cnt.green + " (" + Math.round(100 * cnt.green / total) + "%)" : '');
        return typeof console != 'undefined' && console !== null ? console.log(it.properties.ivid, val(vote.get(it.properties.ivid))) : void 8;
      };
      x$ = g.selectAll('path').data(villages.features).enter();
      x$.append('path').attr('d', path).on('mouseover', show);
      x$.append('circle').attr('opacity', 0.5).attr('r', function(it){
        return scale2(val(vote.get(it.properties.ivid)));
      }).attr("stroke-width", function(it){
        return scale2(valWin(vote.get(it.properties.ivid)));
      }).attr("stroke", function(it){
        return colorWin(vote.get(it.properties.ivid));
      }).attr('cx', function(it){
        var ref$;
        return (ref$ = path.centroid(it)) != null ? ref$[0] : void 8;
      }).attr('cy', function(it){
        var ref$;
        return (ref$ = path.centroid(it)) != null ? ref$[1] : void 8;
      }).on('mouseover', show);
      d3.select('input.filter').attr('value', 'ILA');
      setWanted('ILA');
      zoomTo = function(set){
        var b, s, ref$, x, y;
        b = path.bounds(set);
        s = 0.95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
        ref$ = b[0], x = ref$[0], y = ref$[1];
        x -= (width / s - (b[1][0] - b[0][0])) / 2;
        y -= (height / s - (b[1][1] - b[0][1])) / 2;
        return g.transition().duration(1000).attr("transform", "translate(" + 0 / 2 + "," + 0 / 2 + ")scale(" + s + ")translate(" + (-x) + "," + (-y) + ")").style("stroke-width", 5 / s + "px");
      };
      zoomTo({
        type: 'FeatureCollection',
        features: zoomin
      });
      d3.select('span.zoomout').on('click', function(){
        return zoomTo(villages);
      });
      d3.select('span.zoomin').on('click', function(){
        return zoomTo({
          type: 'FeatureCollection',
          features: zoomin
        });
      });
      y$ = d3.select('input.filter');
      y$.on('change', function(){
        var z;
        z = y$[0][0].value;
        return setWanted(z);
      });
      return y$;
    });
  });
});