import { useQuery } from "react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { fetchUserSubscriptionInfo } from "@/lib/actions/fetchSubscriptionInfo";

const useSubscriptionInfo = () => {
  return useQuery(QUERY_KEYS.subscription, () => {
    return fetchUserSubscriptionInfo();
  });
};

export default useSubscriptionInfo;
