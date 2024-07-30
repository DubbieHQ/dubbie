import { Project, Segment, Track } from "@dubbie/db";

export interface ProjectWithTracksAndSegments extends Project {
  tracks: (Track & {
    segments: Segment[];
  })[];
}
