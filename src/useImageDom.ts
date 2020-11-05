import {
  FunctionComponent,
  createElement,
  useEffect,
  useState,
} from 'react';

enum ImageLoadStatus {
  loading,
  loaded,
  failed = -1,
}

interface ImageState extends HTMLImageElement{
  /**
   * If loaded return false, or return Error Object
   */
  error: boolean | Error | Event,
  /**
   * The dom Image instance
   */
  image: HTMLImageElement,
  /**
   * The React Function Component for current Image
   */
  Image: FunctionComponent,
  /**
   * Image load status:
   * loading - 0,
   * loaded = 1,
   * failed = -1
   */
  status: ImageLoadStatus,
}

interface UseImageDomInput {
  /**
  * set image data src
  */
  src: string
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
  ifLoading?: FunctionComponent
  /**
   * If set error component,
   * when image data fetch failed,
   * ImageState Image Component will display as this component
   */
  ifError?: FunctionComponent
}

/* setup an image default state instance */
const defaultState: ImageState = {
  ...new Image(), // implement image props
  error: false, // image error state
  image: new Image(), // the image dom element to export
  status: ImageLoadStatus.loading, // set default loading state
  // eslint-disable-next-line react/void-dom-elements-no-children
  Image: () => createElement('img', {}, null),
  // eslint-disable-next-line react/void-dom-elements-no-children
};

const useImageDom : ({
  src,
  crossOrigin,
  // props,
  ifError,
  ifLoading,
}: UseImageDomInput) => ImageState = ({
  src,
  crossOrigin,
  // props,
  ifError,
  ifLoading,
}) => {
  /* react hooks setup */
  const [state, setState] = useState<ImageState>(defaultState);

  useEffect(() => {
    const { image } = state;

    // set loading component if exist
    if (ifLoading) {
      setState({
        ...state,
        Image: ifLoading,
      });
    }

    const onload = () => {
      /* if loaded, map image props to state */
      const loadState: ImageState = {
        ...state,
        image,
        error: false,
        status: ImageLoadStatus.loaded,
        // eslint-disable-next-line react/void-dom-elements-no-children
        Image: (outerProps) => createElement(
          'img',
          {
            // ...props,
            ...outerProps,
            src,
            crossOrigin: crossOrigin ? 'Anonymous' : null,
          },
          null,
        ),
      };

      try {
        for (const key in image) {
          // @ts-ignore
          loadState[key] = image[key as keyof HTMLImageElement];
        }
      } catch (e) {
        // abort error
      }

      setState(loadState);
    };

    const onerror = (error: ErrorEvent) => {
      /* if error, return error state */
      let errorState = {
        ...state,
        ...image,
        image,
        error,
        status: ImageLoadStatus.failed,
      };

      // set loading component if exist
      if (ifError) {
        errorState = {
          ...errorState,
          Image: ifError,
        };
      }

      try {
        for (const key in image) {
          // @ts-ignore
          errorState[key] = image[key as keyof HTMLImageElement];
        }
      } catch (e) {
        // abort error
      }
      setState(errorState);
    };

    image.src = src;
    if (crossOrigin) image.crossOrigin = 'Anonymous';

    image.addEventListener('load', onload);
    image.addEventListener('error', onerror);

    return function clean() {
      image.removeEventListener('load', onload);
      image.removeEventListener('error', onerror);
      setState(defaultState);
    };
  }, []);

  return state;
};

export default useImageDom;
