import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Posts from "@/pages/postsleaks";
import PostsNews from "@/pages/postsnews";
import PostsPlanned from "@/pages/postsplanned";
import PostsUnreleased from "@/pages/postsunreleased";
import PostsFutureUpdate from "@/pages/postsfutureupdates";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/postsleaks" component={Posts} />
      <Route path="/postsnews" component={PostsNews} />
      <Route path="/postsplanned" component={PostsPlanned} />
       <Route path="/postsfutureupdates" component={PostsFutureUpdate} />
       <Route path="/postsunreleased" component={PostsUnreleased} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;