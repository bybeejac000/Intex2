#!/usr/bin/env python
# coding: utf-8

# In[14]:



# In[15]:


import pandas as pd


# In[16]:


#Prints statistical info about a dataset accounts for data types
def univariate_stats(df:pd.DataFrame, results=False, vis=False ) -> pd.DataFrame:
    import pandas as pd

    df_results = pd.DataFrame(columns=['dtype', 'count', 'missing', 'unique', 'mode','min', 'q1', 'median', 'q3', 'max', 'mean', 'std', 'skew', 'kurt'])



    for col in df:
        dtype = df[col].dtype
        count = df[col].count()
        missing = df[col].isna().sum()
        unique = df[col].nunique()
        try:
            mode = df[col].mode()[0]
        except:
            mode = pd.NA

        if df[col].dtype in ['int64', 'float64']:
            min = df[col].min()
            q1 = df[col].quantile(.25)
            median = df[col].median()
            q3 = df[col].quantile(.75)
            max = df[col].max()
            mean = df[col].mean()
            std = df[col].std()
            skew = df[col].skew()
            kurt = df[col].kurt()

            df_results.loc[col] = [dtype
                                    ,count
                                    ,missing
                                    ,unique
                                    ,mode
                                    ,min
                                    ,q1
                                    ,median
                                    ,q3
                                    ,max
                                    ,mean
                                    ,std
                                    ,skew
                                    ,kurt]
            
            if vis:
                histogram(df[col])

        else:
            df_results.loc[col] = [dtype
                                    ,count
                                    ,missing
                                    ,unique
                                    ,mode
                                    ,'-'
                                    ,'-'
                                    ,'-'
                                    ,'-'
                                    ,'-'
                                    ,'-'
                                    ,'-'
                                    ,'-'
                                    ,'-']
            if vis:
                countplot(df[col])
    
    df_results


    return df_results


# In[17]:


def basic_wrangling(df: pd.DataFrame, messages=False) -> pd.DataFrame:
    import pandas as pd

    for col in df:

        unique = df[col].nunique()
        rows = df.shape[0]
        missing = df[col].isna().sum()

        #Don't want useless values such as unique row numbers
        if (rows - missing) == unique and 'float' not in str(df[col].dtype):
                df.drop(col, inplace=True, axis = 1)
                if messages: print(f'Too many unique values dropped column : {col}')
                    

        elif missing == rows:
            df.drop(col, inplace = True, axis = 1)
            if messages: print(f'Dropped column: {col}')
                
    return df
    


# In[18]:


def parse_dates(df: pd.DataFrame) -> pd.DataFrame:
    import pandas as pd
    from datetime import datetime as dt
    for col in df:
        if str(df[col].dtype) == 'object':
            try:
                df[col] = pd.to_datetime(df[col])
                df[f'{col}_year'] = df[col].dt.year
                df[f'{col}_month'] = df[col].dt.month
                df[f'{col}_day'] = df[col].dt.day
                df[f'{col}_weekday'] = df[col].dt.day_name()
                df[f'{col}_days_since_today'] = (dt.today() - df[col]).dt.days

            except:
                pass
    return df


# In[19]:


def histogram(df:pd.Series, stats = True):
    import seaborn as sns

    if stats:
        import matplotlib.pyplot as plt

        data_min = df.min()
        data_max = df.max()
        data_mean = df.mean()
        data_skew = df.skew()
        data_std = df.std()


        plt.figure(figsize=(10, 6))
        sns.histplot(df, kde=True, color='blue')

       
        plt.axvline(data_min, color='red', linestyle='dashed', linewidth=2, label=f'Min: {data_min:.2f}')
        plt.axvline(data_max, color='green', linestyle='dashed', linewidth=2, label=f'Max: {data_max:.2f}')
        plt.axvline(data_mean, color='black', linestyle='solid', linewidth=2, label=f'Mean: {data_mean:.2f}')
        plt.axvline(data_std, color='blue', linestyle='dashed', linewidth=2, label=f'STD: {data_std:.2f}')

       
        plt.text(data_mean, plt.ylim()[1]*0.9, f'Skewness: {data_skew:.2f}', fontsize=12, color='black')

       
        plt.xlabel(df.name)
        plt.ylabel("Frequency")
        plt.title(f"{df.name} with Min, Max, Mean & Skewness")
        plt.legend()

        plt.show
        



    else:
        sns.histplot(x=df)




# In[20]:


def countplot(df:pd.Series, stats=True):
    import seaborn as sns

    if stats:
        import matplotlib.pyplot as plt
        
        total_counts = df.count()

        missing_count = df.isna().sum()


        plt.figure(figsize=(8, 5))
        ax = sns.countplot( x=df,  palette="coolwarm", hue=df)


        for p in ax.patches:
            count = int(p.get_height())
            ax.annotate(f"{count}", (p.get_x() + p.get_width() / 2, p.get_height()), 
                        ha='center', va='bottom', fontsize=12, fontweight='bold')


        plt.title(f"{df.name} Counts (Missing Values: {missing_count})", fontsize=14)
        plt.xlabel(df.name)
        plt.ylabel("Count")
        plt.show()

    else:
        sns.countplot(x=df)

    


# In[21]:


def bin_categories(df, features=[], cutoff = .05 ,replace_with = "Other", messages=True):
    import pandas as pd

    if not features: features = df.columns



    for feat in features:
        if not pd.api.types.is_numeric_dtype(df[feat]):
            others = df[feat].value_counts()[df[feat].value_counts()/df.shape[0]< cutoff].index
            df.loc[df[feat].isin(others),feat] = replace_with
            

            






    return df 


# In[22]:


#Performs mathmetical tranformations to correct skewness, returns the one closes to 0

def skew_correct(df, feature, max_power=50, messages=True):
  import pandas as pd, numpy as np
  import seaborn as sns, matplotlib.pyplot as plt

  if not pd.api.types.is_numeric_dtype(df[feature]):
    if messages: print(f'{feature} is not numeric. No transformation performed')
    return df

  # Address missing data
  df = basic_wrangling(df, messages=False)
  if messages: print(f"{df.shape[0] - df.dropna().shape[0]} rows were dropped first due to missing data")
  df.dropna(inplace=True)

  # In case the dataset is too big, we can reduce to a subsample
  df_temp = df.copy()
  if df_temp.memory_usage().sum() > 1000000:
    df_temp = df.sample(frac=round(5000 / df.shape[0], 2))

  # Identify the proper transformation (i)
  i = 1
  skew = df_temp[feature].skew()
  if messages: print(f'Starting skew:\t{round(skew, 5)}')
  while round(skew, 2) != 0 and i <= max_power:
    i += 0.01
    if skew > 0:
      skew = np.power(df_temp[feature], 1/i).skew()
    else:
      skew = np.power(df_temp[feature], i).skew()
  if messages: print(f'Final skew:\t{round(skew, 5)} based on raising to {round(i, 2)}')

  # Make the transformed version of the feature in the df DataFrame
  if skew > -0.1 and skew < 0.1:
    if skew > 0:
      corrected = np.power(df[feature], 1/round(i, 3))
      name = f'{feature}_1/{round(i, 3)}'
    else:
      corrected = np.power(df[feature], round(i, 3))
      name = f'{feature}_{round(i, 3)}'
    df[name] = corrected  # Add the corrected version of the feature back into the original df
  else:
    name = f'{feature}_binary'
    df[name] = df[feature]
    if skew > 0:
      df.loc[df[name] == df[name].value_counts().index[0], name] = 0
      df.loc[df[name] != df[name].value_counts().index[0], name] = 1
    else:
      df.loc[df[name] == df[name].value_counts().index[0], name] = 1
      df.loc[df[name] != df[name].value_counts().index[0], name] = 0
    if messages:
      print(f'The feature {feature} could not be transformed into a normal distribution.')
      print(f'Instead, it has been converted to a binary (0/1)')

  if messages:
    f, axes = plt.subplots(1, 2, figsize=[7, 3.5])
    sns.despine(left=True)
    sns.histplot(df_temp[feature], color='b', ax=axes[0], kde=True)
    if skew > -0.1 and skew < 0.1:
      if skew > 0 :
        corrected = np.power(df_temp[feature], 1/round(i, 3))
      else:
        corrected = np.power(df_temp[feature], round(i, 3))
      df_temp['corrected'] = corrected
      sns.histplot(df_temp.corrected, color='g', ax=axes[1], kde=True)
    else:
      df_temp['corrected'] = df[feature]
      if skew > 0:
        df_temp.loc[df_temp['corrected'] == df_temp['corrected'].min(), 'corrected'] = 0
        df_temp.loc[df_temp['corrected'] > df_temp['corrected'].min(), 'corrected'] = 1
      else:
        df_temp.loc[df_temp['corrected'] == df_temp['corrected'].max(), 'corrected'] = 1
        df_temp.loc[df_temp['corrected'] < df_temp['corrected'].max(), 'corrected'] = 0
      sns.countplot(data=df_temp, x='corrected', color='g', ax=axes[1])
    plt.setp(axes, yticks=[])
    plt.tight_layout()
    plt.show()

    return df


# In[23]:


#this model tests if a missing value can be imputed or the column needs to be dropped

def missing_fill(df, label, features=[], row_threshold=.9, col_threshold=.5, acceptable=0.1, mar='drop', force_impute=False, large_dataset=200000, messages=True):
  import pandas as pd, numpy as np
  from scipy import stats
  from statsmodels.stats.proportion import proportions_ztest
  pd.set_option('display.float_format', lambda x: '%.4f' % x)
  from IPython.display import display

  if not label in df.columns:
    print(f'The label provided ({label}) does not exist in the DataFrame provided')
    return df

  start_count = df.count().sum()

  # Drop columns that are missing
  df.dropna(axis=1, thresh=round(col_threshold * df.shape[0]), inplace=True)
  # Drop all rows that have less data than the proportion that row_threshold requires
  df.dropna(axis=0, thresh=round(row_threshold * df.shape[1]), inplace=True)
  if label != "": df.dropna(axis=0, subset=[label], inplace=True)

  if len(features) == 0: features = df.columns  # Set the feature list to everything if nothing is specified

  if pd.api.types.is_numeric_dtype(df[label]):
    df_results = pd.DataFrame(columns=['total missing', 'null x̄', 'non-null x̄', 'null s', 'non-null s', 't', 'p'])
    for feat in features:
      missing = df[feat].isna().sum()
      if missing > 0:
        null = df[df[feat].isna()]
        nonnull = df[~df[feat].isna()]
        t, p = stats.ttest_ind(null[label], nonnull[label]) # Compare the difference in y label between null and nonnull groups
        df_results.loc[feat] = [round(missing), round(null[label].mean(), 6), round(nonnull[label].mean(), 6),
                                round(null[label].std(), 6), round(nonnull[label].std(), 6), t, p]
  else:
    df_results = pd.DataFrame(columns=['total missing', 'null p̂', 'non-null p̂', 'Z', 'p'])
    for feat in features:
      missing = df[feat].isna().sum()
      if missing > 0:
        null = df[df[feat].isna()]
        nonnull = df[~df[feat].isna()]
        for group in null[label].unique():
          p1_num = null[null[label]==group].shape[0]
          p1_den = null[null[label]!=group].shape[0]
          p2_num = nonnull[nonnull[label]==group].shape[0]
          p2_den = nonnull[nonnull[label]!=group].shape[0]
          if p1_num < p1_den:
            numerators = np.array([p1_num, p2_num])
            denominators = np.array([p1_den, p2_den])
            z, p = proportions_ztest(numerators, denominators)
            df_results.loc[f'{feat}_{group}'] = [round(missing), round(p1_num/p1_den, 6), round(p2_num/p2_den, 6), z, p]

  if messages: display(df_results)

  # Now that we know whether the missing values are MAR vs MCAR, fill in with the appropriate value or drop
  if df_results[df_results['p'] < 0.05].shape[0] / df_results.shape[0] > acceptable and not force_impute:
    if mar == 'drop':
      df.dropna(inplace=True) # Drop any rows where this feat is missing regardless of what else is missing
      if messages: print('null rows dropped')
    else: # Fill missing values with median; treat this as a last resort
      for feat in df_results.index:
        if pd.api.types.is_numeric_dtype(df[feat]):
          df[feat].fillna(df[feat].median(), inplace=True)
          if messages: print(f'{feat} filled with median ({df[feat].median()})')
        else:
          df[feat].fillna('missing', inplace=True)
          if messages: print(f'{feat} filled with "missing"')
  else: # Impute the missing data
    from sklearn.preprocessing import OrdinalEncoder
    oe = OrdinalEncoder().fit(df)
    df_encoded = oe.fit_transform(df)
    if df.count().sum() > large_dataset:
      from sklearn.experimental import enable_iterative_imputer
      from sklearn.impute import KNNImputer
      imp = KNNImputer()
      df_imputed = imp.fit_transform(df_encoded)
      df_recoded = oe.inverse_transform(df_imputed)
      df = pd.DataFrame(df_recoded, columns=df.columns, index=df.index)
    else:
      from sklearn.experimental import enable_iterative_imputer
      from sklearn.impute import IterativeImputer
      imp = IterativeImputer()
      df = pd.DataFrame(imp.fit_transform(df), columns=df.columns, index=df.index)
    if messages: print(f'null values imputed')

  return df


# In[24]:


# Documentation
# required: a Pandas DataFrame
# optional:
#  messages = True        -> whether or not to include detailed information about outliers
#  drop_percent = 0.02    -> the percent of the dataset you want dropped as outliers. The eps parameter will be automatically adjusted to accomplish this
#  distance = 'euclidean' -> the distance metric used for the clustering algorithm. Options: ['cityblock', 'cosine', 'euclidean', 'l1', 'l2', 'manhattan']

def clean_outliers(df, messages=True, drop_percent=0.02, distance='manhattan', min_samples=5):
  import pandas as pd, numpy as np, seaborn as sns, matplotlib.pyplot as plt
  from sklearn.cluster import DBSCAN
  from sklearn import preprocessing

  # Clean the dataset first
  if messages: print(f"{df.shape[1] - df.dropna(axis='columns').shape[1]} columns were dropped first due to missing data")
  df.dropna(axis='columns', inplace=True)
  if messages: print(f"{df.shape[0] - df.dropna().shape[0]} rows were dropped first due to missing data")
  df.dropna(inplace=True)
  df_temp = df.copy()
  df_temp = bin_categories(df_temp, features=df_temp.columns, messages=False)
  df_temp = basic_wrangling(df_temp, features=df_temp.columns, messages=False)
  df_temp = pd.get_dummies(df_temp, drop_first=True)
  # Normalize the dataset
  df_temp = pd.DataFrame(preprocessing.MinMaxScaler().fit_transform(df_temp), columns=df_temp.columns, index=df_temp.index)

  # Calculate the number of outliers based on a range of eps values
  outliers_per_eps = []
  outliers = df_temp.shape[0]
  eps = 0

  if df_temp.shape[0] < 500:
    iterator = 0.01
  elif df_temp.shape[0] < 2000:
    iterator = 0.05
  elif df_temp.shape[0] < 10000:
    iterator = 0.1
  elif df_temp.shape[0] < 25000:
    iterator = 0.2

  while outliers > 0:
    eps += iterator
    db = DBSCAN(metric=distance, min_samples=min_samples, eps=eps).fit(df_temp)
    outliers = np.count_nonzero(db.labels_ == -1)
    outliers_per_eps.append(outliers)
    if messages: print(f'eps: {round(eps, 2)}, outliers: {outliers}, percent: {round((outliers / df_temp.shape[0])*100, 3)}%')

  drops = min(outliers_per_eps, key=lambda x:abs(x-round(df_temp.shape[0] * drop_percent)))
  eps = (outliers_per_eps.index(drops) + 1) * iterator
  db = DBSCAN(metric=distance, min_samples=min_samples, eps=eps).fit(df_temp)
  df['outlier'] = db.labels_

  if messages:
    print(f"{df[df['outlier'] == -1].shape[0]} outlier rows removed from the DataFrame")
    sns.lineplot(x=range(1, len(outliers_per_eps) + 1), y=outliers_per_eps)
    sns.scatterplot(x=[eps/iterator], y=[drops])
    plt.xlabel(f'eps (divide by {iterator})')
    plt.ylabel('Number of Outliers')
    plt.show()

  # Drop rows that are outliers
  df = df[df['outlier'] != -1]
  return df


# In[25]:


def bivariate_stats(df, label, roundto=4):
  import pandas as pd
  from scipy import stats

  output_df = pd.DataFrame(columns=['missing', 'p', 'r', 'y = m(x) + b', 'F', 'X2'])

  for feature in df.columns:
    if feature != label:
      df_temp = df[[feature, label]]
      df_temp = df_temp.dropna()
      missing = (df.shape[0] - df_temp.shape[0]) / df.shape[0]

      if pd.api.types.is_numeric_dtype(df_temp[feature]) and pd.api.types.is_numeric_dtype(df_temp[label]):
        m, b, r, p, err = stats.linregress(df_temp[feature], df_temp[label])
        output_df.loc[feature] = [f'{missing:.2%}', round(p, roundto), round(r, roundto), f'y = {round(m, roundto)}(x) + {round(b, roundto)}', '-', '-']

      elif not pd.api.types.is_numeric_dtype(df_temp[feature]) and not pd.api.types.is_numeric_dtype(df_temp[label]):
        contingency_table = pd.crosstab(df_temp[feature], df_temp[label]) # Calculate the crosstab
        X2, p, dof, expected = stats.chi2_contingency(contingency_table)  # Calculate the Chi-square based on the crosstab
        output_df.loc[feature] = [f'{missing:.2%}', round(p, roundto), '-', '-', '-', round(X2, roundto)]

      else:
        if pd.api.types.is_numeric_dtype(df_temp[feature]):
          num = feature
          cat = label
        else:
          num = label
          cat = feature

        groups = df_temp[cat].unique()
        group_lists = []
        for g in groups:
          g_list = df_temp[df_temp[cat] == g][num]
          group_lists.append(g_list)

        results = stats.f_oneway(*group_lists)
        F = results[0]
        p = results[1]
        output_df.loc[feature] = [f'{missing:.2%}', round(p, roundto), '-', '-', round(F, roundto), '-']
  return output_df.sort_values(by=['p'])


# In[26]:


# Converts boolean to 1 and 0
def convert_bool(df:pd.DataFrame) -> pd.DataFrame:
    cols = df.select_dtypes(bool)
    import warnings
    warnings.filterwarnings("ignore") 

    for item in cols:
        df.loc[df[item] == True, item] = 1;
        df.loc[df[item] == False, item] = 0;
        df[item] = df[item].astype('int64')

    return df

