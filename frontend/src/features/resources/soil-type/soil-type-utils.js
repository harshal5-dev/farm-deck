const setSoilTypeColor = (soilType) => {
  switch (soilType.name) {
    case "loamy":
      return "leaf";
    case "sandy":
      return "amber";
    case "sandy_loam":
      return "wheat";
    case "clay":
      return "clay";
    case "clay_loam":
      return "rose";
    case "silt":
      return "sky";
    case "chalky":
      return "stone";
    case "peaty":
      return "clay-deep";
    default:
      return "leaf";
  }
};

export const transformGetSoilTypesResponse = (response) => {
  const soilTypes = response.data.map((soilType) => {
    return {
      ...soilType,
      color: setSoilTypeColor(soilType),
    };
  });
  return {
    soilTypes,
    total: response.meta.total,
  };
};
