const setFarmTypeIconAndColor = (name) => {
  switch (name) {
    case "outdoor":
      return { icon: "sun", color: "amber" };
    case "greenhouse":
      return { icon: "building-warehouse", color: "emerald" };
    case "mixed":
      return { icon: "arrows-exchange", color: "violet" };
    case "indoor":
      return { icon: "building", color: "sky" };
    case "vertical":
      return { icon: "stack-2", color: "indigo" };
    default:
      return { icon: "sun", color: "amber" };
  }
};

export const transformGetFarmTypesResponse = (response) => {
  const farmTypes = response.data.map((farmType) => {
    return {
      ...farmType,
      ...setFarmTypeIconAndColor(farmType.name),
    };
  });
  return {
    farmTypes,
    total: response.meta.total,
  };
};
