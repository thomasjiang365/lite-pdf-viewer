import React, { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useResizeObserver } from '@wojtekmaj/react-hooks';

import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';

import ROUTES_DATA from '../../routes';
import './index.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

const resizeObserverOptions = {};

const maxWidth = 800;

type PDFFile = string | File | null;

interface IProps {}

export default function PDFViewer(props: IProps) {
  const [searchParams] = useSearchParams();
  const filePath = searchParams.get('path') || '';
  const navigate = useNavigate();
  const onBack = () => {
    navigate(ROUTES_DATA.HOME.path);
  };

  const [numPages, setNumPages] = useState<number>();
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  const onResize = useCallback<any>((entries: any) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  return (
    <>
      <div className="home-header">
        <button type="button" onClick={onBack}>
          Back Home
        </button>
      </div>
      <div className="Example__container__document" ref={setContainerRef}>
        <Document
          file={{
            url: `file:///${filePath}`,
          }}
          // eslint-disable-next-line react/jsx-no-bind
          onLoadSuccess={onDocumentLoadSuccess}
          options={options}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={
                containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
              }
            />
          ))}
        </Document>
      </div>
    </>
  );
}
