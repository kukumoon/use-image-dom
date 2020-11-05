# UseImageDom React Hook

Custom React Hook loading images. It loads passed url and creates DOM image with such `src`.
Useful handling image `loading` or `error` state and UI, and easily get every image properties extends `HTMLImageElement` Interface

## Installation
```shell script
# use npm
npm install use-image-dom --save

# use yarn
yarn add use-image-dom
```

## Example
[Live Demo Here](https://codesandbox.io/s/recursing-pond-kcsh5)

## API
### useImageDom
We can use `useImageDom` hook to create image resource, by giving our hook an `src` property and maybe `crossOrigin` property needed.

And if you want custom the UI reference for image element when loading or load failed, you can give also give our hook an `ifLoading` or `ifError` prop, this property receives a React `FunctionComponent` Instance.

Once you create the hook by the properties before, you can easily use every property on `Image` Instance by destruct hook Object, and some more properties `useImageDom` giving like:
- `Image` The React `FunctionComponent` for the current image, it accepted any properties using on `<img/>` element.
    - when image loading, if `ifLoading` property has defined as a React `FunctionComponent`, `Image` will display this Component.
    - when image Load failed, if `ifError` property has defined as a React `FunctionComponent`, `Image` will display this Component.
- `status` The load status enum for image,
    - maybe you want to custom Your image UI in any lifecycle when image loading, use `status` enum is really helpful to you.
    - loading - 0,
    - loaded = 1,
    - failed = -1
- `error` If image loaded return false, or return Error Object.
- `image` `new Image()` instance hook using.
- Any other properties on HTML Image Instance like width, height, etc.

#### Usage
````javascript
import useImage from "use-image-dom";

function ImageExample() {
  const { 
    Image, 
    status, 
    image,
    error,
    width, 
    height, 
    // ... any Image Instance Property
  } = useImage({
    src:
      "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
    crossOrigin: false, // or do not use this property
    ifLoading: () => (<div>loading...</div>),
    ifError: () => (<div>error...</div>)
  });

  // status: -1 = failed, 0 = loading , 1 = loaded
  if (status === 1) {
    console.log(width, height, image);
  }

  if(error /** or status = -1 */) {
    console.log(error);
  }

  return (
    <div className="ImageExample">
      <Image width={width / 2} height={height / 2} />
    </div>
  );
}
````

## Interface
``` typescript
declare enum ImageLoadStatus {
    loading = 0,
    loaded = 1,
    failed = -1
}
interface ImageState extends HTMLImageElement {
    /**
     * If loaded return false, or return Error Object
     */
    error: boolean | Error | Event;
    /**
     * The dom Image instance
     */
    image: HTMLImageElement;
    /**
     * The React Function Component for current Image
     */
    Image: FunctionComponent;
    /**
     * Image load status:
     * loading - 0,
     * loaded = 1,
     * failed = -1
     */
    status: ImageLoadStatus;
}
interface UseImageDomInput {
    /**
    * set image data src
    */
    src: string;
    /**
    * set Image crossOrigin,
    * true get anonymous,
    * false get use-credentials
    */
    crossOrigin?: boolean;
    /**
    * set Props for ImageState Image Component
    */
    /** @deprecated */
    props?: HTMLImageElement;
    /**
    * If set loading component,
    * when image data is fetching,
    * ImageState Image Component will display as this component
    */
    ifLoading?: FunctionComponent;
    /**
     * If set error component,
     * when image data fetch failed,
     * ImageState Image Component will display as this component
     */
    ifError?: FunctionComponent;
}

declare const useImageDom: ({ src, crossOrigin, ifError, ifLoading, }: UseImageDomInput) => ImageState;
```