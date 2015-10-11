/* -*- Mode: js; js-indent-level: 2; indent-tabs-mode: nil; tab-width: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/* Copyright (c) 2015, Art Compiler LLC */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assertJs = require("./assert.js");

var colorbrewer = { YlGn: {
    3: ["#f7fcb9", "#addd8e", "#31a354"],
    4: ["#ffffcc", "#c2e699", "#78c679", "#238443"],
    5: ["#ffffcc", "#c2e699", "#78c679", "#31a354", "#006837"],
    6: ["#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#31a354", "#006837"],
    7: ["#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#005a32"],
    8: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#005a32"],
    9: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"]
  }, YlGnBu: {
    3: ["#edf8b1", "#7fcdbb", "#2c7fb8"],
    4: ["#ffffcc", "#a1dab4", "#41b6c4", "#225ea8"],
    5: ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"],
    6: ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494"],
    7: ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"],
    8: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"],
    9: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"]
  }, GnBu: {
    3: ["#e0f3db", "#a8ddb5", "#43a2ca"],
    4: ["#f0f9e8", "#bae4bc", "#7bccc4", "#2b8cbe"],
    5: ["#f0f9e8", "#bae4bc", "#7bccc4", "#43a2ca", "#0868ac"],
    6: ["#f0f9e8", "#ccebc5", "#a8ddb5", "#7bccc4", "#43a2ca", "#0868ac"],
    7: ["#f0f9e8", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#08589e"],
    8: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#08589e"],
    9: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"]
  }, BuGn: {
    3: ["#e5f5f9", "#99d8c9", "#2ca25f"],
    4: ["#edf8fb", "#b2e2e2", "#66c2a4", "#238b45"],
    5: ["#edf8fb", "#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c"],
    6: ["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#2ca25f", "#006d2c"],
    7: ["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"],
    8: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"],
    9: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#006d2c", "#00441b"]
  }, PuBuGn: {
    3: ["#ece2f0", "#a6bddb", "#1c9099"],
    4: ["#f6eff7", "#bdc9e1", "#67a9cf", "#02818a"],
    5: ["#f6eff7", "#bdc9e1", "#67a9cf", "#1c9099", "#016c59"],
    6: ["#f6eff7", "#d0d1e6", "#a6bddb", "#67a9cf", "#1c9099", "#016c59"],
    7: ["#f6eff7", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016450"],
    8: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016450"],
    9: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636"]
  }, PuBu: {
    3: ["#ece7f2", "#a6bddb", "#2b8cbe"],
    4: ["#f1eef6", "#bdc9e1", "#74a9cf", "#0570b0"],
    5: ["#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d"],
    6: ["#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#2b8cbe", "#045a8d"],
    7: ["#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#034e7b"],
    8: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#034e7b"],
    9: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"]
  }, BuPu: {
    3: ["#e0ecf4", "#9ebcda", "#8856a7"],
    4: ["#edf8fb", "#b3cde3", "#8c96c6", "#88419d"],
    5: ["#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c"],
    6: ["#edf8fb", "#bfd3e6", "#9ebcda", "#8c96c6", "#8856a7", "#810f7c"],
    7: ["#edf8fb", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#6e016b"],
    8: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#6e016b"],
    9: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"]
  }, RdPu: {
    3: ["#fde0dd", "#fa9fb5", "#c51b8a"],
    4: ["#feebe2", "#fbb4b9", "#f768a1", "#ae017e"],
    5: ["#feebe2", "#fbb4b9", "#f768a1", "#c51b8a", "#7a0177"],
    6: ["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#c51b8a", "#7a0177"],
    7: ["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177"],
    8: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177"],
    9: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"]
  }, PuRd: {
    3: ["#e7e1ef", "#c994c7", "#dd1c77"],
    4: ["#f1eef6", "#d7b5d8", "#df65b0", "#ce1256"],
    5: ["#f1eef6", "#d7b5d8", "#df65b0", "#dd1c77", "#980043"],
    6: ["#f1eef6", "#d4b9da", "#c994c7", "#df65b0", "#dd1c77", "#980043"],
    7: ["#f1eef6", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#91003f"],
    8: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#91003f"],
    9: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f"]
  }, OrRd: {
    3: ["#fee8c8", "#fdbb84", "#e34a33"],
    4: ["#fef0d9", "#fdcc8a", "#fc8d59", "#d7301f"],
    5: ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"],
    6: ["#fef0d9", "#fdd49e", "#fdbb84", "#fc8d59", "#e34a33", "#b30000"],
    7: ["#fef0d9", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#990000"],
    8: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#990000"],
    9: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"]
  }, YlOrRd: {
    3: ["#ffeda0", "#feb24c", "#f03b20"],
    4: ["#ffffb2", "#fecc5c", "#fd8d3c", "#e31a1c"],
    5: ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"],
    6: ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026"],
    7: ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"],
    8: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"],
    9: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"]
  }, YlOrBr: {
    3: ["#fff7bc", "#fec44f", "#d95f0e"],
    4: ["#ffffd4", "#fed98e", "#fe9929", "#cc4c02"],
    5: ["#ffffd4", "#fed98e", "#fe9929", "#d95f0e", "#993404"],
    6: ["#ffffd4", "#fee391", "#fec44f", "#fe9929", "#d95f0e", "#993404"],
    7: ["#ffffd4", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#8c2d04"],
    8: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#8c2d04"],
    9: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]
  }, Purples: {
    3: ["#efedf5", "#bcbddc", "#756bb1"],
    4: ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#6a51a3"],
    5: ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"],
    6: ["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"],
    7: ["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486"],
    8: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486"],
    9: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"]
  }, Blues: {
    3: ["#deebf7", "#9ecae1", "#3182bd"],
    4: ["#eff3ff", "#bdd7e7", "#6baed6", "#2171b5"],
    5: ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"],
    6: ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c"],
    7: ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594"],
    8: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594"],
    9: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]
  }, Greens: {
    3: ["#e5f5e0", "#a1d99b", "#31a354"],
    4: ["#edf8e9", "#bae4b3", "#74c476", "#238b45"],
    5: ["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"],
    6: ["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#31a354", "#006d2c"],
    7: ["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"],
    8: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"],
    9: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"]
  }, Oranges: {
    3: ["#fee6ce", "#fdae6b", "#e6550d"],
    4: ["#feedde", "#fdbe85", "#fd8d3c", "#d94701"],
    5: ["#feedde", "#fdbe85", "#fd8d3c", "#e6550d", "#a63603"],
    6: ["#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#e6550d", "#a63603"],
    7: ["#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04"],
    8: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04"],
    9: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"]
  }, Reds: {
    3: ["#fee0d2", "#fc9272", "#de2d26"],
    4: ["#fee5d9", "#fcae91", "#fb6a4a", "#cb181d"],
    5: ["#fee5d9", "#fcae91", "#fb6a4a", "#de2d26", "#a50f15"],
    6: ["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"],
    7: ["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d"],
    8: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d"],
    9: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"]
  }, Greys: {
    3: ["#f0f0f0", "#bdbdbd", "#636363"],
    4: ["#f7f7f7", "#cccccc", "#969696", "#525252"],
    5: ["#f7f7f7", "#cccccc", "#969696", "#636363", "#252525"],
    6: ["#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#636363", "#252525"],
    7: ["#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525"],
    8: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525"],
    9: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"]
  }, PuOr: {
    3: ["#f1a340", "#f7f7f7", "#998ec3"],
    4: ["#e66101", "#fdb863", "#b2abd2", "#5e3c99"],
    5: ["#e66101", "#fdb863", "#f7f7f7", "#b2abd2", "#5e3c99"],
    6: ["#b35806", "#f1a340", "#fee0b6", "#d8daeb", "#998ec3", "#542788"],
    7: ["#b35806", "#f1a340", "#fee0b6", "#f7f7f7", "#d8daeb", "#998ec3", "#542788"],
    8: ["#b35806", "#e08214", "#fdb863", "#fee0b6", "#d8daeb", "#b2abd2", "#8073ac", "#542788"],
    9: ["#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788"],
    10: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"],
    11: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"]
  }, BrBG: {
    3: ["#d8b365", "#f5f5f5", "#5ab4ac"],
    4: ["#a6611a", "#dfc27d", "#80cdc1", "#018571"],
    5: ["#a6611a", "#dfc27d", "#f5f5f5", "#80cdc1", "#018571"],
    6: ["#8c510a", "#d8b365", "#f6e8c3", "#c7eae5", "#5ab4ac", "#01665e"],
    7: ["#8c510a", "#d8b365", "#f6e8c3", "#f5f5f5", "#c7eae5", "#5ab4ac", "#01665e"],
    8: ["#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#c7eae5", "#80cdc1", "#35978f", "#01665e"],
    9: ["#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e"],
    10: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"],
    11: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"]
  }, PRGn: {
    3: ["#af8dc3", "#f7f7f7", "#7fbf7b"],
    4: ["#7b3294", "#c2a5cf", "#a6dba0", "#008837"],
    5: ["#7b3294", "#c2a5cf", "#f7f7f7", "#a6dba0", "#008837"],
    6: ["#762a83", "#af8dc3", "#e7d4e8", "#d9f0d3", "#7fbf7b", "#1b7837"],
    7: ["#762a83", "#af8dc3", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#7fbf7b", "#1b7837"],
    8: ["#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837"],
    9: ["#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837"],
    10: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"],
    11: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"]
  }, PiYG: {
    3: ["#e9a3c9", "#f7f7f7", "#a1d76a"],
    4: ["#d01c8b", "#f1b6da", "#b8e186", "#4dac26"],
    5: ["#d01c8b", "#f1b6da", "#f7f7f7", "#b8e186", "#4dac26"],
    6: ["#c51b7d", "#e9a3c9", "#fde0ef", "#e6f5d0", "#a1d76a", "#4d9221"],
    7: ["#c51b7d", "#e9a3c9", "#fde0ef", "#f7f7f7", "#e6f5d0", "#a1d76a", "#4d9221"],
    8: ["#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221"],
    9: ["#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221"],
    10: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"],
    11: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"]
  }, RdBu: {
    3: ["#ef8a62", "#f7f7f7", "#67a9cf"],
    4: ["#ca0020", "#f4a582", "#92c5de", "#0571b0"],
    5: ["#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"],
    6: ["#b2182b", "#ef8a62", "#fddbc7", "#d1e5f0", "#67a9cf", "#2166ac"],
    7: ["#b2182b", "#ef8a62", "#fddbc7", "#f7f7f7", "#d1e5f0", "#67a9cf", "#2166ac"],
    8: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"],
    9: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"],
    10: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"],
    11: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"]
  }, RdGy: {
    3: ["#ef8a62", "#ffffff", "#999999"],
    4: ["#ca0020", "#f4a582", "#bababa", "#404040"],
    5: ["#ca0020", "#f4a582", "#ffffff", "#bababa", "#404040"],
    6: ["#b2182b", "#ef8a62", "#fddbc7", "#e0e0e0", "#999999", "#4d4d4d"],
    7: ["#b2182b", "#ef8a62", "#fddbc7", "#ffffff", "#e0e0e0", "#999999", "#4d4d4d"],
    8: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#e0e0e0", "#bababa", "#878787", "#4d4d4d"],
    9: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d"],
    10: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"],
    11: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"]
  }, RdYlBu: {
    3: ["#fc8d59", "#ffffbf", "#91bfdb"],
    4: ["#d7191c", "#fdae61", "#abd9e9", "#2c7bb6"],
    5: ["#d7191c", "#fdae61", "#ffffbf", "#abd9e9", "#2c7bb6"],
    6: ["#d73027", "#fc8d59", "#fee090", "#e0f3f8", "#91bfdb", "#4575b4"],
    7: ["#d73027", "#fc8d59", "#fee090", "#ffffbf", "#e0f3f8", "#91bfdb", "#4575b4"],
    8: ["#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"],
    9: ["#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"],
    10: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"],
    11: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"]
  }, Spectral: {
    3: ["#fc8d59", "#ffffbf", "#99d594"],
    4: ["#d7191c", "#fdae61", "#abdda4", "#2b83ba"],
    5: ["#d7191c", "#fdae61", "#ffffbf", "#abdda4", "#2b83ba"],
    6: ["#d53e4f", "#fc8d59", "#fee08b", "#e6f598", "#99d594", "#3288bd"],
    7: ["#d53e4f", "#fc8d59", "#fee08b", "#ffffbf", "#e6f598", "#99d594", "#3288bd"],
    8: ["#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd"],
    9: ["#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd"],
    10: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"],
    11: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"]
  }, RdYlGn: {
    3: ["#fc8d59", "#ffffbf", "#91cf60"],
    4: ["#d7191c", "#fdae61", "#a6d96a", "#1a9641"],
    5: ["#d7191c", "#fdae61", "#ffffbf", "#a6d96a", "#1a9641"],
    6: ["#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#91cf60", "#1a9850"],
    7: ["#d73027", "#fc8d59", "#fee08b", "#ffffbf", "#d9ef8b", "#91cf60", "#1a9850"],
    8: ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"],
    9: ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"],
    10: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"],
    11: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"]
  }, Accent: {
    3: ["#7fc97f", "#beaed4", "#fdc086"],
    4: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99"],
    5: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0"],
    6: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f"],
    7: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17"],
    8: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17", "#666666"]
  }, Dark2: {
    3: ["#1b9e77", "#d95f02", "#7570b3"],
    4: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a"],
    5: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e"],
    6: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02"],
    7: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d"],
    8: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"]
  }, Paired: {
    3: ["#a6cee3", "#1f78b4", "#b2df8a"],
    4: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c"],
    5: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99"],
    6: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c"],
    7: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f"],
    8: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00"],
    9: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6"],
    10: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a"],
    11: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99"],
    12: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"]
  }, Pastel1: {
    3: ["#fbb4ae", "#b3cde3", "#ccebc5"],
    4: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4"],
    5: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6"],
    6: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc"],
    7: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd"],
    8: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec"],
    9: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"]
  }, Pastel2: {
    3: ["#b3e2cd", "#fdcdac", "#cbd5e8"],
    4: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4"],
    5: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9"],
    6: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae"],
    7: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc"],
    8: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc", "#cccccc"]
  }, Set1: {
    3: ["#e41a1c", "#377eb8", "#4daf4a"],
    4: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3"],
    5: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"],
    6: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33"],
    7: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628"],
    8: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf"],
    9: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"]
  }, Set2: {
    3: ["#66c2a5", "#fc8d62", "#8da0cb"],
    4: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3"],
    5: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854"],
    6: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f"],
    7: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494"],
    8: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"]
  }, Set3: {
    3: ["#8dd3c7", "#ffffb3", "#bebada"],
    4: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072"],
    5: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3"],
    6: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462"],
    7: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69"],
    8: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5"],
    9: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9"],
    10: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd"],
    11: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5"],
    12: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"]
  } };
var https = require('https');
var http = require('http');

(0, _assertJs.reserveCodeRange)(1000, 1999, "compile");
_assertJs.messages[1001] = "Node ID %1 not found in pool.";
_assertJs.messages[1002] = "Invalid tag in node with Node ID %1.";
_assertJs.messages[1003] = "No aync callback provided.";
_assertJs.messages[1004] = "No visitor method defined for '%1'.";

var translate = (function () {
  var nodePool = undefined;
  function translate(pool, resume) {
    console.log("pool=" + JSON.stringify(pool, null, 2));
    nodePool = pool;
    return visit(pool.root, {}, resume);
  };
  function error(str, nid) {
    return {
      str: str,
      nid: nid
    };
  };
  function visit(nid, options, resume) {
    (0, _assertJs.assert)(typeof resume === "function", (0, _assertJs.message)(1003));
    // Get the node from the pool of nodes.
    var node = nodePool[nid];
    (0, _assertJs.assert)(node, (0, _assertJs.message)(1001, [nid]));
    (0, _assertJs.assert)(node.tag, (0, _assertJs.message)(1001, [nid]));
    (0, _assertJs.assert)(typeof table[node.tag] === "function", (0, _assertJs.message)(1004, [node.tag]));
    return table[node.tag](node, options, resume);
  };
  // BEGIN VISITOR METHODS
  var edgesNode = undefined;
  function str(node, options, resume) {
    var val = node.elts[0];
    resume([], val);
  };
  function num(node, options, resume) {
    var val = node.elts[0];
    resume([], val);
  };
  function ident(node, options, resume) {
    var val = node.elts[0];
    resume([], val);
  };
  function bool(node, options, resume) {
    var val = node.elts[0];
    resume([], val);
  };
  function add(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      val1 = +val1;
      if (isNaN(val1)) {
        err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
      }
      visit(node.elts[1], options, function (err2, val2) {
        val2 = +val2;
        if (isNaN(val2)) {
          err2 = err2.concat(error("Argument must be a number.", node.elts[1]));
        }
        resume([].concat(err1).concat(err2), val1 + val2);
      });
    });
  };
  function set(node, options, resume, params) {
    visit(node.elts[0], options, function (err, val) {
      if (typeof val !== "object" || !val || !val.tree) {
        err = err.concat(error("Argument Data invalid.", node.elts[0]));
      } else {
        if (params.op && params.op === "default") {
          val[params.prop] = params.val;
          resume([].concat(err), val);
        } else if (params.op && params.op === "positive") {
          visit(node.elts[1], options, function (err2, val2) {
            if (isNaN(val2) || val2 <= 0) {
              err2 = err2.concat(error("Argument must be a positive number.", node.elts[1]));
            }
            if (typeof val === "object" && val) {
              val[params.prop] = +val2;
            }
            resume([].concat(err).concat(err2), val);
          });
        } else {
          resume([].concat(err), val);
        }
      }
    });
  };
  function data(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      var ret = {
        tree: val,
        height: 500,
        width: 960,
        orientation: 'vertical',
        style: [],
        color: [{ r: 200, g: 200, b: 200, a: 1 }],
        opacity: 1,
        bcolor: { r: 255, g: 255, b: 255, a: 1 },
        graphtype: 'icicle',
        rotation: 0
      };
      if (typeof val !== "string" && (typeof val !== "object" || !val)) {
        err = err.concat(error("Data must be a URL.", node.elts[0]));
      }
      resume([].concat(err), ret);
    });
  };
  function width(node, options, resume) {
    var params = {
      op: "positive",
      prop: "width"
    };
    set(node, options, function (err, val) {
      resume([].concat(err), val);
    }, params);
  };
  function height(node, options, resume) {
    var params = {
      op: "positive",
      prop: "height"
    };
    set(node, options, function (err, val) {
      resume([].concat(err), val);
    }, params);
  };
  function horizontal(node, options, resume) {
    var params = {
      op: "default",
      prop: "orientation",
      val: "horizontal"
    };
    set(node, options, function (err, val) {
      resume([].concat(err), val);
    }, params);
  };
  function vertical(node, options, resume) {
    var params = {
      op: "default",
      prop: "orientation",
      val: "vertical"
    };
    set(node, options, function (err, val) {
      resume([].concat(err), val);
    }, params);
  };
  function labels(node, options, resume) {
    var lab = [false, false, false]; //labelling[0] is key, labelling [1] is value.
    visit(node.elts[1], options, function (err2, val2) {
      //parameter list
      if (typeof val2 === "string") {
        val2 = [val2];
      }
      if (!(val2 instanceof Array)) {
        err2 = err2.concat(error("Argument be a string parameter or array thereof.", node.elts[1]));
      } else {
        val2.forEach(function (element, index, array) {
          if (element === "name" || element === "key") {
            lab[0] = true;
          } else if (element === "number" || element === "value") {
            lab[1] = true;
          } else if (element === "image" || element === "picture") {
            lab[2] = true;
          } else {
            err2 = err2.concat(error(element + " is not a valid label parameter, try name or value.", node.elts[1]));
          }
        });
      }
      var params = {
        op: "default",
        prop: "labelling",
        val: lab
      };
      set(node, options, function (err, val) {
        //graph
        resume([].concat(err), val);
      }, params);
    });
  };
  function zoom(node, options, resume) {
    var params = {
      op: "default",
      prop: "zoom",
      val: true
    };
    set(node, options, function (err, val) {
      resume([].concat(err), val);
    }, params);
  };
  var colors = {
    "yellow green": 'YlGn',
    "yellow green blue": 'YlGnBu',
    "green blue": 'GnBu',
    "blue green": 'BuGn',
    "purple blue green": 'PuBuGn',
    "purple blue": 'PuBu',
    "blue purple": 'BuPu',
    "red purple": 'RdPu',
    "purple red": 'PuRd',
    "orange red": 'OrRd',
    "yellow orange red": 'YlOrRd',
    "yellow orange brown": 'YlOrBr',
    "purple": 'Purples',
    "blue": 'Blues',
    "green": 'Greens',
    "orange": 'Oranges',
    "red": 'Reds',
    "grey": 'Greys',
    "purple orange": 'PuOr',
    "brown bluegreen": 'BrBG',
    "purple green": 'PRGn',
    "pink yellowgreen": 'PiYG',
    "red blue": 'RdBu',
    "red grey": 'RdGy',
    "red yellow blue": 'RdYlBu',
    "red yellow green": 'RdYlGn'
  };
  function color(node, options, resume) {
    //takes in array (colorbrewer or not) of hex values and the data object
    var ret = [];
    visit(node.elts[1], options, function (err2, val2) {
      if (!(val2 instanceof Array)) {
        var temp = colorcheck(val2);
        if (temp.err && temp.err.length) {
          err2 = err2.concat(error(temp.err + ".", node.elts[1]));
        }
        ret = ret.concat(temp);
      } else {
        val2.forEach(function (element, index, array) {
          temp = colorcheck(element);
          if (temp.err && temp.err.length) {
            err2 = err2.concat(error(temp.err + " at index " + index + ".", node.elts[1]));
          }
          ret = ret.concat(temp);
        });
      }
      //assuming no errors it's formatted correctly without further issue.
      var params = {
        op: "default",
        prop: "color",
        val: ret
      };
      set(node, options, function (err1, val1) {
        resume([].concat(err1).concat(err2), val1);
      }, params);
    });
  };
  function colorcheck(val) {
    var ret = {};
    if (typeof val === "string" && /^#[0-9A-F]{6}$/i.test(val)) {
      //valid hex string.
      var temp = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(val);
      ret = {
        r: parseInt(temp[1], 16),
        g: parseInt(temp[2], 16),
        b: parseInt(temp[3], 16)
      };
    } else if (!isNaN(val.r) && !isNaN(val.g) && !isNaN(val.b)) {
      ret = val;
    } else {
      ret.err = "Please provide a valid color";
    }
    return ret;
  };
  function bcolor(node, options, resume) {
    visit(node.elts[1], options, function (err2, val2) {
      var ret = colorcheck(val2);
      if (ret.err && ret.err.length) {
        err2 = err2.concat(error(ret.err + ".", node.elts[1]));
      }
      if (isNaN(ret.a)) {
        ret.a = 1;
      }
      var params = {
        op: "default",
        prop: "bcolor",
        val: ret
      };
      set(node, options, function (err1, val1) {
        resume([].concat(err1).concat(err2), val1);
      }, params);
    });
  };
  function leaf(node, options, resume) {
    var leaf = {
      parts: 'all',
      ranges: [],
      colors: []
    };
    visit(node.elts[2], options, function (err2, val2) {
      //ranges
      if (!(val2 instanceof Array)) {
        err2 = err2.concat(error("Please provide a list of value ranges.", node.elts[2]));
      } else {
        val2.forEach(function (element, index, array) {
          if (!element[0] || isNaN(element[0]) || !element[1] || isNaN(element[1])) {
            err2 = err2.concat(error("Index " + index + " lacks valid range parameters.", node.elts[2]));
          }
        });
        leaf.ranges = leaf.ranges.concat(val2);
      }
      visit(node.elts[1], options, function (err3, val3) {
        //colors
        var ret = [];
        if (!(val3 instanceof Array)) {
          err3 = err3.concat(error("Please provide an array or brewer color.", node.elts[1]));
        } else {
          val3.forEach(function (element, index, array) {
            var temp = colorcheck(element);
            if (temp.err && temp.err.length) {
              err3 = err3.concat(error(temp.err + " at index " + index + ".", node.elts[1]));
            }
            ret = ret.concat(temp);
          });
          leaf.colors = leaf.colors.concat(ret);
        }
        visit(node.elts[3], options, function (err4, val4) {
          //text parameters
          if (val4 === 'leaves' || val4 === 'leaf' || val4 === 'leafs') {
            leaf.parts = 'leaf';
          } else if (val4 === 'branch' || val4 === 'branches') {
            leaf.parts = 'branch';
          }
          var params = {
            op: "default",
            prop: "leaf",
            val: leaf
          };
          set(node, options, function (err1, val1) {
            //graph
            resume([].concat(err1).concat(err3).concat(err2).concat(err4), val1);
          }, params);
        });
      });
    });
  };
  function opacity(node, options, resume) {
    visit(node.elts[1], options, function (err2, val2) {
      if (isNaN(val2) || val2 < 0) {
        err2 = err2.concat(error("Alpha must be a positive number.", node.elts[1]));
      } else {
        val2 = +val2;
        if (val2 > 1 && val2 < 100) {
          val2 = val2 / 100;
        } else if (val2 > 100) {
          val2 = 1;
        }
      }
      var params = {
        op: "default",
        prop: "opacity",
        val: val2
      };
      set(node, options, function (err1, val1) {
        resume([].concat(err1).concat(err2), val1);
      }, params);
    });
  };
  function brewer(node, options, resume) {
    //takes in color string, outputs array
    var ret = 0;
    visit(node.elts[0], options, function (err, val) {
      if (val instanceof Array) {
        val = val.join(" ");
      }
      if (!colors[val]) {
        err = err.concat(error("Unrecognized color, please use lower case.", node.elts[0]));
      } else {
        ret = colorbrewer[colors[val]][9];
      }
      resume([].concat(err), ret); //finds the right name and then grabs the colorbrewer array
    });
  };
  function rgba(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      //a
      if (isNaN(val1) || val1 < 0) {
        err1 = err1.concat(error("Alpha must be a positive number.", node.elts[0]));
      } else {
        if (val1 > 1 && val1 < 100) {
          val1 = val1 / 100;
        } else if (val1 > 100) {
          val1 = 1;
        }
      }
      var test = node.elts.shift();
      rgb(node, options, function (err2, val2) {
        //run rgb, add alpha
        val2.a = val1;
        node.elts.unshift(test);
        resume([].concat(err1).concat(err2), val2);
      });
    });
  };
  function rgb(node, options, resume) {
    var ret = {
      r: 0,
      g: 0,
      b: 0
    };
    visit(node.elts[0], options, function (err1, val1) {
      //b
      if (isNaN(val1) || val1 < 0 || +val1 > 255) {
        err1 = err1.concat(error("Argument must be between 0 and 255.", node.elts[0]));
      }
      ret.b = +val1;
      visit(node.elts[1], options, function (err2, val2) {
        //g
        if (isNaN(val2) || val2 < 0 || +val2 > 255) {
          err2 = err2.concat(error("Argument must be between 0 and 255.", node.elts[1]));
        }
        ret.g = +val2;
        visit(node.elts[2], options, function (err3, val3) {
          //r
          if (isNaN(val3) || val3 < 0 || +val3 > 255) {
            err3 = err3.concat(error("Argument must be between 0 and 255.", node.elts[2]));
          }
          ret.r = +val3;
          resume([].concat(err1).concat(err2).concat(err3), ret);
        });
      });
    });
  };
  function gist(node, options, resume) {};
  function icicle(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      if (typeof val !== "object" || !val || !val.tree) {
        err = err.concat(error("Argument Data invalid.", node.elts[0]));
      } else {
        //have to make sure it's an object before you start assigning properties.
        if (typeof val.tree === "string") {
          var protocol = undefined;
          if (val.tree.indexOf("https") >= 0) {
            protocol = https;
          } else {
            protocol = http;
          }
          protocol.get(val.tree, function (res) {
            var obj = '';

            res.on('data', function (d) {
              obj += d;
            });

            res.on('end', function () {
              var fin = JSON.parse(obj);
              val.tree = fin;
              if (fin) {
                if (fin.error && fin.error.length > 0) {
                  err = err.concat(error("Attempt to parse JSON returned" + fin.error, node.elts[0]));
                }
              }
              val.graphtype = 'icicle';
              resume([].concat(err), val);
            });
          }).on('error', function (e) {
            err = err.concat(error("Attempt to get data returned" + e, node.elts[0]));
            resume([].concat(err), val);
          });
        } else {
          if (typeof val.tree !== "object") {
            err = err.concat(error("Data is not a tree.", node.elts[0]));
          } else {
            val.graphtype = 'icicle';
          }
          resume([].concat(err), val);
        }
      }
    });
  };
  function sunburst(node, options, resume) {
    icicle(node, options, function (err, val) {
      val.graphtype = 'sunburst'; //just overwrite this
      resume([].concat(err), val);
    });
  };
  function rotate(node, options, resume) {
    visit(node.elts[1], options, function (err2, val2) {
      if (isNaN(val2)) {
        if (val2 === 'free') {} else {
          err2 = err2.concat(error("Argument must be a number.", node.elts[1]));
        }
      } else {
        val2 = +val2;
      }
      var params = {
        op: "default",
        prop: "rotation",
        val: val2
      };
      set(node, options, function (err1, val1) {
        resume([].concat(err1).concat(err2), val1);
      }, params);
    });
  };
  function style(node, options, resume) {
    visit(node.elts[1], options, function (err2, val2) {
      var params = {
        op: "default",
        prop: "style",
        val: val2
      };
      set(node, options, function (err1, val1) {
        resume([].concat(err1).concat(err2), val1);
      }, params);
    });
  };
  function binding(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        resume([].concat(err1).concat(err2), { key: val1, val: val2 });
      });
    });
  };
  function exprs(node, options, resume) {
    if (node.elts && node.elts.length) {
      visit(node.elts[0], options, function (err1, val1) {
        node.elts.shift();
        exprs(node, options, function (err2, val2) {
          val2.unshift(val1);
          resume([].concat(err1).concat(err2), val2);
        });
      });
    } else {
      resume([], []);
    }
  };
  function program(node, options, resume) {
    if (!options) {
      options = {};
    }
    visit(node.elts[0], options, resume);
  };
  var table = {
    "PROG": program,
    "EXPRS": exprs,
    "STR": str,
    "NUM": num,
    "IDENT": ident,
    "BOOL": bool,
    "LIST": exprs,
    "RECORD": exprs,
    "BINDING": binding,
    "ADD": add,
    "STYLE": style,
    "DATA": data,
    "WIDTH": width,
    "HEIGHT": height,
    "HOR": horizontal,
    "VER": vertical,
    "ICICLE": icicle,
    "SUNBURST": sunburst,
    "LABELS": labels,
    "COLOR": color,
    "BCOLOR": bcolor,
    "ZOOM": zoom,
    "ROTATE": rotate,
    "RGB": rgb,
    "RGBA": rgba,
    "BREWER": brewer,
    "LEAF": leaf,
    "OPACITY": opacity,
    "GIST": gist
  };
  return translate;
})();
var render = (function () {
  function escapeXML(str) {
    return String(str).replace(/&(?!\w+;)/g, "&amp;").replace(/\n/g, " ").replace(/\\/g, "\\\\").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function render(val, resume) {
    // Do some rendering here.
    resume([], val);
  };
  return render;
})();
var compiler = (function () {
  exports.compile = function compile(pool, resume) {
    // Compiler takes an AST in the form of a node pool and translates it into
    // an object to be rendered on the client by the viewer for this language.
    try {
      translate(pool, function (err, val) {
        console.log("translate err=" + JSON.stringify(err, null, 2) + "\nval=" + JSON.stringify(val, null, 2));
        if (err.length) {
          resume(err, val);
        } else {
          render(val, function (err, val) {
            console.log("render err=" + JSON.stringify(err, null, 2) + "\nval=" + JSON.stringify(val, null, 2));
            resume(err, val);
          });
        }
      });
    } catch (x) {
      console.log("ERROR with code");
      console.log(x.stack);
      resume("Compiler error", {
        score: 0
      });
    }
  };
})();
exports.compiler = compiler;
