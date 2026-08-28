import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Job } from "../models/jobSchema.js";
import ErrorHandler from "../middlewares/error.js";

export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const searchJobs = catchAsyncErrors(async (req, res, next) => {
  const {
    keyword,
    location,
    category,
    jobType,
    companyName,
    qualification,
    minSalary,
    maxSalary,
    page = 1,
    limit = 20,
  } = req.query;

  const filter = {
    expired: false,
  };

  // Keyword search across relevant text fields.
  if (keyword) {
    const regex = new RegExp(keyword, "i");

    filter.$or = [
      { title: regex },
      { description: regex },
      { category: regex },
      { qualification: regex },
      { companyName: regex },
    ];
  }

  // Location
  if (location) {
    filter.location = {
      $regex: location,
      $options: "i",
    };
  }

  // Category
  if (category) {
    filter.category = {
      $regex: category,
      $options: "i",
    };
  }

  // Work mode
  if (jobType) {
    filter.jobType = {
      $regex: jobType,
      $options: "i",
    };
  }

  // Company
  if (companyName) {
    filter.companyName = {
      $regex: companyName,
      $options: "i",
    };
  }

  // Qualification
  if (qualification) {
    filter.qualification = {
      $regex: qualification,
      $options: "i",
    };
  }

  // Salary
  if (minSalary || maxSalary) {
    const min = minSalary ? Number(minSalary) : 0;
    const max = maxSalary ? Number(maxSalary) : Infinity;

    if (Number.isNaN(min) || Number.isNaN(max)) {
      return next(new ErrorHandler("Invalid salary filter.", 400));
    }

    const salaryConditions = [];

    // Jobs with salary range
    salaryConditions.push({
      salaryFrom: { $lte: max },
      salaryTo: { $gte: min },
    });

    // Jobs with fixed salary
    salaryConditions.push({
      $expr: {
        $and: [
          { $ne: ["$fixedSalary", null] },
          {
            $gte: [
              {
                $convert: {
                  input: "$fixedSalary",
                  to: "double",
                  onError: null,
                  onNull: null,
                },
              },
              min,
            ],
          },
          {
            $lte: [
              {
                $convert: {
                  input: "$fixedSalary",
                  to: "double",
                  onError: null,
                  onNull: null,
                },
              },
              max,
            ],
          },
        ],
      },
    });

    filter.$or = filter.$or
      ? [
        {
          $and: [
            { $or: filter.$or },
            { $or: salaryConditions },
          ],
        },
      ]
      : salaryConditions;
  }

  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.min(
    Math.max(Number(limit), 1),
    50
  );

  const skip = (pageNumber - 1) * limitNumber;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .sort({ jobPostedOn: -1 })
      .skip(skip)
      .limit(limitNumber),

    Job.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: jobs.length,
    total,
    page: pageNumber,
    totalPages: Math.ceil(total / limitNumber),
    jobs,
  });
});

export const postJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const {
    companyName,
    title,
    description,
    category,
    vacancy,
    qualification,
    location,
    fixedSalary,
    timePeriod,
    salaryFrom,
    salaryTo,
    jobType,
  } = req.body;

  if (!companyName || !title || !description || !category || !location || !timePeriod || !qualification || !jobType) {
    return next(new ErrorHandler("Please provide full job details.", 400));
  }

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(
      new ErrorHandler(
        "Please either provide fixed salary or ranged salary.",
        400
      )
    );
  }

  if (salaryFrom && salaryTo && fixedSalary) {
    return next(
      new ErrorHandler("Cannot Enter Fixed and Ranged Salary together.", 400)
    );
  }
  const postedBy = req.user._id;
  const job = await Job.create({
    companyName,
    title,
    description,
    category,
    vacancy,
    jobType,
    qualification,
    location,
    fixedSalary,
    timePeriod,
    salaryFrom,
    salaryTo,
    postedBy,
  });
  res.status(200).json({
    success: true,
    message: "Job Posted Successfully!",
    job,
  });
});

export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const myJobs = await Job.find({ postedBy: req.user._id });
  res.status(200).json({
    success: true,
    myJobs,
  });
});

export const countJobs = catchAsyncErrors(async (req, res, next) => {
  const jobCount = await Job.countDocuments({ expired: false })
  res.status(200).json({
    success: true,
    jobCount,
  })
})

export const countByCategory = catchAsyncErrors(async (req, res, next) => {
  const results = await Job.aggregate([
    { $match: { expired: false } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  const categoryCounts = results.reduce((acc, { _id, count }) => {
    acc[_id] = count;
    return acc;
  }, {});

  res.status(200).json({ success: true, categoryCounts });
});

export const updateJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  let job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }
  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Job Updated!",
  });
});

export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }
  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job Deleted!",
  });
});

export const getJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler("Job not found.", 404));
    }
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return next(new ErrorHandler(`Invalid ID / CastError`, 404));
  }
});
