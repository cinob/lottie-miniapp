import { Canvas, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { Component } from "react";
import lottie from "lottie-miniapp";
import "./index.less";

export default class Index extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.renderCanvas();
    }, 100);
  }

  renderCanvas() {
    const query = wx.createSelectorQuery();
    const animationPath =
      "https://img1.tuhu.org/ae/FvW3mtaqPb8dVyhkkCRE1HDIBBz3.json";
    query
      .select("#test-canvas")
      .fields({ node: true, size: true })
      .exec((res) => {
        console.log(res);
        const canvas = res[0].node;
        const ctx = canvas.getContext("2d");

        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        lottie.loadAnimation({
          renderer: "canvas", // 只支持canvas
          loop: true,
          autoplay: true,
          path: animationPath,
          rendererSettings: {
            // 这里需要填 canvas
            canvas: canvas,
            context: ctx,
            clearCanvas: true,
          },
        });
      });
  }

  render() {
    return (
      <Canvas id="test-canvas" canvasId="test-canvas" className="test-canvas" />
    );
  }
}
