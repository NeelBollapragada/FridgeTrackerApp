import NetInfo from "@react-native-community/netinfo";

export const checkNetwork = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable;
  } catch (error) {
    console.error("Error checking network status:", error);
    return false;
  }
};
