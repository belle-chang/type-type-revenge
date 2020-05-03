// class ResourceTracker {
//     constructor() {
//       this.resources = new Set();
//     }
//     track(resource) {
//       if (resource.dispose) {
//         this.resources.add(resource);
//       }
//       return resource;
//     }
//     untrack(resource) {
//       this.resources.delete(resource);
//     }
//     dispose() {
//       for (const resource of this.resources) {
//         resource.dispose();
//       }
//       this.resources.clear();
//     }
// }
import * as THREE from 'three';
class ResourceTracker {
  constructor() {
    this.resources = new Set();
  }
  track(resource) {
    if (resource.dispose || resource instanceof THREE.Object3D) {
      this.resources.add(resource);
    }
    return resource;
  }
  untrack(resource) {
    this.resources.delete(resource);
  }
  dispose() {
    for (const resource of this.resources) {
      if (resource instanceof THREE.Object3D) {
        if (resource.parent) {
          resource.parent.remove(resource);
        }
      }
      if (resource.dispose) {
        resource.dispose();
      }
    }
    this.resources.clear();
  }
}

export default ResourceTracker;