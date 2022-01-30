const config = {
    screens: {
        DrawerScreen: {
        path: "DrawerScreen",
        parse: {
          id: (id) => `${id}`,
        },
      },
    }
  };
  
  const linking = {
    prefixes: ["Fit4yoursport://"],
    config,
  };
  
  