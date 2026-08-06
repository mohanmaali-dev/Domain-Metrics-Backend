import {  getDomainMetrics as getDomainMetricsData } from '../services/mozService.js';

export const getDomainMetrics = async (request, response) => {
  try {
    const domain = request.body?.domain?.trim();

    if (!domain) {
      return response.status(400).json({
        success: false,
        message: 'Domain is required',
      });
    }

    const result = await getDomainMetricsData(domain);

    response.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log('Error fetching domain metrics:', error);
    response.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
